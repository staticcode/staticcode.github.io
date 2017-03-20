import React, { PropTypes } from 'react';
import Checkbox from '../../../../components/advertika/CheckboxV2';


const FilterSection = ({ name, title, tooltip, items, selectedItems, onChange, onReset, ico }) => {
  const deviceIcon = { 2: 'i-tablet', 1: 'i-phone' };
  return (
    <div className={`c-vertical-filter__settings-group ${selectedItems && selectedItems.length ? '__selected' : ''}`}>

      <div className="c-vertical-filter__settings-group-t">
        <strong>{`${title} `}</strong>
        {tooltip && <i className="ion-help-circled txt-primary" data-tip={tooltip} />}
      {!!(selectedItems && selectedItems.length) &&
        <div className="right link" onClick={ () => onReset(name)} >
          Сбросить
        </div> }
      </div>

      <div className="c-vertical-filter__settings-group-cnt">
      {items && items.map(item => (

        <Checkbox
          key={item.id}
          checked={selectedItems && selectedItems.indexOf(item.id) !== -1}
          onChange={e => onChange(name, item.id, e)}
        >
          {!!ico && <i className={`${ico} ${item[item.name ? 'name' : 'title'].toLowerCase()}`} />}
          {name === 'device' && <i className={deviceIcon[item.id]} />}
          {' '}
          <span>{item.title}</span>
{/*
          <span className="c-vertical-filter_item-counter">
            {loadingCount
              ? <img src="/images/loading.gif" width="19px" />
              : filterCounts.tn && filterCounts.tn[item.id]}
          </span>
*/}
        </Checkbox>

      ))}
      </div>

    </div>
  );
};

FilterSection.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  items: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

FilterSection.defaultProps = {
  selectedItems: []
};


export default FilterSection;
