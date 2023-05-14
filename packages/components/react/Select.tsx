//types
import type { ReactNode, KeyboardEvent } from 'react';
export type SelectOption = {
  label: ReactNode,
  value?: any,
  keyword?: string|Function
};
export type SelectDropdownProps = { 
  options: SelectOption[]
  show: boolean,
  searchable?: boolean,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  select: (value: SelectOption) => void,
  search: (e: KeyboardEvent) => void,
  match: (option: SelectOption) => void
};
export type SelectProps = {
  value?: SelectOption,
  options: SelectOption[],
  searchable?: boolean,
  label?: string,
  placeholder?: string,
  error?: string,
  errorColor?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  onSelected?: (value: SelectOption) => void,
  onUpdate?: (value: string|number) => void
};
//hooks
import React, { useState } from 'react';
//components
import Input from './Input';
//helpers
import { makeGroupClasses } from '../helpers/makeClasses';
import { makeGroupStyles } from '../helpers/makeStyles';

/**
 * Select Dropdown - Can be used separately (like in autocomplete)
 */
export const SelectDropdown: React.FC<SelectDropdownProps> = (props) => {
  const { 
    options, 
    show, 
    searchable,
    classNames = {},
    styles = {}, 
    select, 
    search, 
    match 
  } = props;

  const map = {
    styles: makeGroupStyles(styles, {
      dropdown: {
        backgroundColor: '#EFEFEF',
        borderColor: 'black',
        borderStyle: 'solid',
        borderBottomWidth: '1px',
        borderLeftWidth: '1px',
        borderRightWidth: '1px',
        display: !show ? 'none': undefined,
        marginTop: '-1px',
        position: 'absolute',
        width: '100%'
      },
      searchField: {
        paddingBottom: '4px',
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingTop: '4px',
        position: 'relative'
      },
      searchControl: {
        paddingRight: '32px'
      },
      searchIcon: {
        backgroundColor: 'white',
        color: 'black',
        padding: '4px',
        position: 'absolute',
        right: '9px',
        top: '9px'
      },
      options: {
        maxHeight: '256px',
        overflow: 'auto'
      },
      option: {
        alignItems: 'center',
        borderColor: '#AAAAAA',
        borderStyle: 'solid',
        borderTopWidth: '1px',
        cursor: 'pointer',
        display: 'flex',
        paddingBottom: '8px',
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: '8px'
      }
    }),
    classNames: makeGroupClasses(classNames, {
      dropdown: undefined,
      searchField: undefined,
      searchControl: undefined,
      searchIcon: undefined,
      options: undefined,
      option: undefined
    })
  };

  return (
    <div className={map.classNames.dropdown} style={map.styles.dropdown}>
      {searchable && (
        <Input 
          classNames={{ 
            field: map.classNames.searchField,
            control: map.classNames.searchControl 
          }} 
          styles={{ 
            field: map.styles.searchField,
            control: map.styles.searchControl 
          }} 
          onKeyUp={search}
        >
          <span 
            className={map.classNames.searchIcon} 
            style={map.styles.searchIcon}
          >
            <i className="fas fa-search"></i>
          </span>
        </Input>
      )}
      <div className={map.classNames.options} style={map.styles.options}>
        {options.filter(match).map((option, i) => (
          <div 
            key={i} 
            onClick={_ => select(option)} 
            className={map.classNames.option} 
            style={map.styles.option}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 *  Select (Main)
 */
const Select: React.FC<SelectProps> = (props) => {
  const { 
    options,
    searchable,
    value,
    label, 
    placeholder = 'Choose an Option',
    error, 
    errorColor = '#DC3545',
    classNames = {},
    styles = {},
    onSelected,
    onUpdate
  } = props;

  //search query string
  const [ query, setQuery ] = useState('');
  //selected option
  const [ selected, setSelected ] = useState(value);
  //whether to show dropdown
  const [ showing, show ] = useState(false);
  
  const toggle = () => show(!showing);
  //updates query string
  const search = (e: KeyboardEvent) => {
    setTimeout(() => {
      const input = e.target as HTMLInputElement;
      setQuery(input.value);
    });
  };
  //matches options with query string
  const match = (option: SelectOption) => {
    const keyword = (query || '').toLowerCase();
    if (typeof option.keyword === 'string') {
      return option.keyword
        .toLowerCase()
        .indexOf(keyword) >= 0;
    } else if (typeof option.keyword === 'function') {
      return option.keyword(keyword);
    }
  };
  //selects an option from the dropdown
  const select = (option: SelectOption) => {
    show(false);
    setSelected(option);
    onSelected && onSelected(option);
    onUpdate && onUpdate(option.value);
  };

  const map = {
    styles: makeGroupStyles(styles, {
      container: {
        position: 'relative',
        color: error?.length ? errorColor: undefined
      },
      label: { display: 'block' },
      field: undefined,
      control: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: error?.length ? errorColor :'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        color: error?.length ? errorColor :'black',
        display: 'flex',
        paddingBottom: '8px',
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: '8px',
        whiteSpace: 'nowrap',
        width: '100%'
      },
      error: undefined
    }),
    classNames: makeGroupClasses(classNames, {
      container: undefined,
      label: undefined,
      field: undefined,
      control: undefined,
      error: undefined
    })
  };

  return (
    <div className={map.classNames.container} style={map.styles.container}>
      {label?.length && (
        <label className={map.classNames.label} style={map.styles.label}>
          {label}
        </label>
      )}
      <div className={map.classNames.field} style={map.styles.field}>
        <div 
          className={map.classNames.control} 
          style={map.styles.control} 
          onClick={toggle}
        >
          {value?.label || selected?.label || (
            <span style={{ color: '#666666' }}>{placeholder}</span>
          )}
        </div>
        <SelectDropdown 
          options={options} 
          show={showing} 
          searchable={searchable} 
          classNames={classNames}
          styles={styles}
          select={select} 
          search={search} 
          match={match} 
        />
      </div>
      {error?.length && (
        <div className={map.classNames.error} style={map.styles.error}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Select;