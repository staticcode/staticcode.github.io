import React, { PropTypes } from 'react';
import { numberWithSpaces } from './helpers';


const CellCoverage = (props) => {
  const { data } = props;

  const renderStatus = (status) => {
    switch (status) {
      case '0':
        return <span className="txt-disabled">статистика закрыта</span>;
      case '1':
        return <a className="txt-success" target="_blank" href={data.statistic.link}>открыта статистика</a>;
      default :
        return null;
    }
  };

  return (
    <div className={Object.keys(data).length > 2 ? null : 'center'}>
      {Object.keys(data).filter(c => c != 'statistic').map(c => (
        <div key={c}>
          {(Object.keys(data).length > 2) &&
            <span
              className={`i-${c.replace('coverage_', '')}-exchange`}
              data-tip={c == 'coverage_stat' ? 'stat' : null}
              style={{ verticalAlign: 'middle', marginRight: 5 }}
            />
          }
          {`${numberWithSpaces(data[c].covPost)} / ${numberWithSpaces(data[c].covUser)}`}
        </div>))}

      {renderStatus(data.statistic.status)}
    </div>
  );
};


CellCoverage.propTypes = {
  data: PropTypes.object,
};

export default CellCoverage;
