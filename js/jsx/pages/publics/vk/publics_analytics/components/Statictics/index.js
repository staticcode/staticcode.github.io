import React from 'react';
import Highcharts from 'react-highcharts';
import ReactTooltip from '../../../../../../components/react-tooltip/react-tooltip';
import SortableTable from '../../../../../../components/react-sortable-table/sortable-table';
import Chart from './Chart';


const Analytics = () => {
  if (!window.access && !window.isOpenedStatistic) {
    return (
      <div className="bg-darken-1 p3 mb1 center">
        <p>Аналитика данного сообщества не доступна на Демо-тарифе.</p>
        <a className="[ button __success __lg ]" href="/cabinet/info/tarif">Выбрать платный тариф</a>
      </div>
    );
  }
  return (
    <div>
      <Chart config={window.chart1()} data={window.c1data}>
        Активность аудитории %
        {' '}
        <i
          className="ion-help-circled txt-primary"
          data-tip="Процент аудитории, вовлечённой в посты, <br>сделанные в определенный день недели / время"
        />
      </Chart>
      <Chart config={window.chart2()} data={window.c2data}>
        Активность за период
        {' '}
        <i
          className="ion-help-circled txt-primary"
          data-tip={`
            Суммарное количество действий  аудитории (лайки, репосты и комментарии), <br>
            распределённое по дням (график за месяц), неделям (график за квартал), <br>
            месяцам (график за всё время).
          `}
        />
      </Chart>
      <Chart config={window.chart2()} data={window.c3data}>
        Прирост участников
        {' '}
        <i
          className="ion-help-circled txt-primary"
          data-tip={`
            Изменение численности аудитории сообщества, <br>
            на графиках показан прирост за период: <br>
            по дням (график за месяц), неделям (график за квартал), месяцам (график за всё время)
          `}
        />
      </Chart>

      <section className="mb4">

        <h3>
          Демография
          {' '}
        <i className="ion-help-circled txt-primary" data-tip="Информация о структуре целевой аудитории." />
        </h3>
        <div className="clearfix">
          <div className="left col-33">
            <Highcharts config={window.chart9} />
          </div>

          {window.chartvk.series[0].data.length
            ? <div>
              <div className="left col-15">
                <Highcharts config={window.chart10} />
              </div>
              <div className="left col-15">
                <Highcharts config={window.chartvk} />
              </div>
            </div>

            : <div className="left col-33">
              <Highcharts config={window.chart10} />
            </div> }

          <div className="left col-33">
            <Highcharts config={window.chart11} />
          </div>
        </div>
      </section>
      <section id="countries">
        <h3>
          Страны
          {' '}
          <i
            className="ion-help-circled txt-primary"
            data-tip="Информация о количестве подписчиков по странам."
          />
          </h3>
        <SortableTable
          className="tbl __center"
          data={window.coutryTableData().length ? window.coutryTableData() : window.coutryTableDataVK()}
          columns={window.coutryTableConfig()}
        />
      </section>
      {(!!window.isManage && !!window.coutryTableDataVK().length) &&
        <section>
          <h3>Страны VK</h3>
          <SortableTable
            className="tbl __center"
            data={window.coutryTableDataVK()}
            columns={window.coutryTableConfig()}
          />
        </section>}

        <ReactTooltip place="top" type="light" effect="float" multiline />
    </div>
  )
};


export default Analytics;
