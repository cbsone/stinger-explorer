import React, {Component} from 'react'
import cx from 'classnames'

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as Api from '../../../api/api';

import './InfoTable.sass'
// import './HoldersTable.sass'
// import './StakedTable.sass'
// import './UnstakedTable.sass'
// import './RAMTable.sass'

// am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);

/**
 * --- Внимание! ---
 * 
 * По всем вопросам работы с графиком
 * обращаться к Егору
 * 
 * --- Внимание! ---
 */

export default class InfoTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 'Top Holders',
      values: [],
      page: 0,
      total: 0,
      cbsSupply: 0
    }

    // Заготовленные цвета для долей графика и процентов
    this.chartColors = [
      '#F8A500', '#FA1100', '#E3027A', '#3E02E3', '#0A5BFC',
      '#0DBCC9', '#49D78B', '#5CD749', '#CEEF00', '#B3B3B3',
    ]
    // Тестовые проценты для графика
    this.chartValues = [40, 14, 10, 6, 4, 3, 3, 2, 1, 10]

    this.changeTab = this.changeTab.bind(this)
    this.buildChartData = this.buildChartData.bind(this)
    this.getRecords = this.getRecords.bind(this);
  }

  changeTab(name) {
    this.setState({
      activeTab: name,
      values: [],
      page: 0,
      total: 0
    })

    this.getRecords(name, 0)
  }

  getRecords(name = '', page = 0) {
    name = name === '' ? this.state.activeTab : name;
    switch (name) {
      case 'Top Holders':
        Api.getTopHolders(page * 10, 10).then(items => {
          this.setState({values: items.values, total: items.count, page});
        })
      break;
      case 'Top Staked':
        Api.getTopStake(page * 10, 10).then(items => {
          this.setState({values: items.values, total: items.count, page});
        })
      break;
      case 'Top Unstaked':
        Api.getTopUnstake(page * 10, 10).then(items => {
          this.setState({values: items.values, total: items.count, page});
        })
      break;
      case 'Top RAM':
        Api.getTopRAM(page * 10, 10).then(items => {
          this.setState({values: items.values, total: items.count, page});
        })
      break;
      default:
      break;
    }
  }

  // Генерация тестовых данных для графика
  buildChartData(holders = [], supply = 100) {
    // console.log(holders, supply)

    let data = [];
    let other_percent = 100.0;
    holders.filter(v => v.name !== 'cbs').slice(0, holders.length > 10 ? 9 : holders.length).map((item, i) => {
      const p = Api.percent(Api.cbsfmt(item.cbs_balance), supply) * 100;
      data.push({
      "label": item.name,
      "percent": p,
      "color": am4core.color(this.chartColors[i])
      });

      other_percent -= p;
      return null;
    })

    if (other_percent > 0) {
      data.push({
        "label": 'other',
        'percent': other_percent,
        'color': am4core.color(this.chartColors[9])
      })
    }

    // console.log(data);
    // for (let i = 0; i < 10; i++) {
    //   data.push({
    //     "label": "cbshuobipool",
    //     "percent": this.chartValues[i],
    //     "color": am4core.color(this.chartColors[i]),
    //   })
    // }

    

    return data
  }

  // СОздание и добавление графика после отрисовки страницы
  componentDidMount() {
    Api.getResLoad().then(stats => {
      this.setState({cbsSupply: stats.cbs_staked});
      Api.getTopHolders(0).then(holders => {
        if (this.state.activeTab !== 'Top Holders') return
        /**
         * Создание графика с помощью библиотеки am4core
         * и добавление в уже отрисованный блок с id="chart"
         */
        let chart = am4core.create("chart", am4charts.PieChart)
        
        // Добавление массива объектов с ифой ( [{ *инфа* }, ..., { *инфа* }] )
        chart.data = this.buildChartData(holders.values, stats.cbs_staked);
    
        // Внутренний радиус - то самое пустое место внутри
        chart.innerRadius = am4core.percent(64)
    
        // Настройки
        let pieSeries = chart.series.push(new am4charts.PieSeries())
    
        pieSeries.dataFields.value = "percent"
        pieSeries.dataFields.category = "label"
    
        pieSeries.slices.template.propertyFields.fill = "color"
        pieSeries.slices.template.stroke = am4core.color("#fff")
        pieSeries.slices.template.strokeWidth = 2
        pieSeries.slices.template.strokeOpacity = 1
        pieSeries.slices.template.tooltipText = ""
    
        // pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
        pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    
        pieSeries.labels.template.text = "{category} {value.value}"
        pieSeries.ticks.template.disabled = true
    
        // Стартовая анимация
        pieSeries.hiddenState.properties.opacity = 1
        pieSeries.hiddenState.properties.endAngle = -90
        pieSeries.hiddenState.properties.startAngle = -90

        // chart.legend = new am4charts.Legend();
    
        // Без таймаута не видит сгенерированный svg график через querySelector
        setTimeout(() => {
          let chartContainer = document.getElementById('chart')
          let labels = chartContainer.querySelectorAll('g[role="menu"] text tspan') // Текстовые поля
          let paths = chartContainer.querySelectorAll('g[role="menu"] g[role="menuitem"]') // Дольки графика
    
          chartContainer.querySelector('g[role="region"]').nextSibling.remove() // Удаление ссылки на сайт-источник данной билиотеки
          
          // Модификаация делений графика
          for (let i = 0; i < paths.length; i++) {
            paths[i].setAttributeNS(null, 'class', 'chart-hover-item')
            // Появление текста при наведении
            paths[i].addEventListener('mouseenter', function () {
              if (window.outerWidth > 670) chartContainer.querySelector(`g[item-id="chi-${i}"]`).setAttributeNS(null, 'fill-opacity', 1)
              let texts = chartContainer.querySelectorAll(`#chart g[item-id="chi-${i}"] tspan`)
              if (window.outerWidth <= 670) document.getElementById('chart-center-label').innerHTML = `<span style="color: ${ texts[0].parentElement.getAttributeNS(null, 'fill') }">${ texts[0].innerHTML }</span><br/><span style="color: #3E445B">${ texts[1].innerHTML }</span>`
            })
    
            // Скрытие текста при уводе курсора
            paths[i].addEventListener('mouseleave', function () {
              if (window.outerWidth > 670) chartContainer.querySelector(`g[item-id="chi-${i}"]`).setAttributeNS(null, 'fill-opacity', 0)
              if (window.outerWidth <= 670) document.getElementById('chart-center-label').innerHTML = 'TOP 10<br/>HOLDERS'
            })
          }
    
          // Модификаация текстовых полей
          for (let i = 0; i < labels.length; i++) {
            let data = labels[i].innerHTML.split(' ')
    
            // Модификаация контейнера, в котором лежит текст
            labels[i].parentElement.parentElement.setAttributeNS(null, 'class', 'chart-label-container')
            labels[i].parentElement.parentElement.setAttributeNS(null, 'item-id', `chi-${i}`)
            labels[i].parentElement.parentElement.setAttributeNS(null, 'fill-opacity', 0)
            
            // Добавления отдельного элемента для процетов
            let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            element.setAttributeNS(null, 'class', 'chart-label-percent')
            element.setAttributeNS(null, 'x', 0)
            element.setAttributeNS(null, 'x', 0)
            element.setAttributeNS(null, 'dy', -5)
            element.setAttributeNS(null, 'fill', this.chartColors[i])
            element.innerHTML = `<tspan>${data[1]}%</tspan>`
    
            labels[i].parentElement.parentElement.prepend(element)
    
            labels[i].setAttributeNS(null, 'class', 'chart-label-text')
            labels[i].innerHTML = data[0]
          }
        }, 50)
      })
    })

    this.getRecords('', 0)
  }

  render() {
    return (
      <div className={ cx('info-table', {
        'active-top-holders' : this.state.activeTab === 'Top Holders',
        'active-top-staked' : this.state.activeTab === 'Top Staked',
        'active-top-unstaked' : this.state.activeTab === 'Top Unstaked',
        'active-top-ram' : this.state.activeTab === 'Top RAM',
      }) }>
        <div className="info-table__tabs-scroll-wrapper">
          <div className="info-table__tabs-row">
            <div className={ cx('info-table__tabs-row_tab', { 'active-tab' : this.state.activeTab === 'Top Holders' }) } onClick={ () => this.changeTab('Top Holders') }>
              <span>Top Holders</span>
            </div>
            <div className={ cx('info-table__tabs-row_tab', { 'active-tab' : this.state.activeTab === 'Top Staked' }) } onClick={ () => this.changeTab('Top Staked') }>
              <span>Top Staked</span>
            </div>
            <div className={ cx('info-table__tabs-row_tab', { 'active-tab' : this.state.activeTab === 'Top Unstaked' }) } onClick={ () => this.changeTab('Top Unstaked') }>
              <span>Top Unstaked</span>
            </div>
            <div className={ cx('info-table__tabs-row_tab', { 'active-tab' : this.state.activeTab === 'Top RAM' }) } onClick={ () => this.changeTab('Top RAM') }>
              <span>Top RAM</span>
            </div>
          </div>
        </div>
        <div className="info-table__swap-wraper">
          { tableTopHolders(this.state, (page) => this.getRecords('', page)) }
          { tableTopStacked(this.state, (page) => this.getRecords('', page)) }
          { tableTopUnstacked(this.state, (page) => this.getRecords('', page)) }
          { tableTopRAM(this.state, (page) => this.getRecords('', page)) }
        </div>
      </div>
    )
  }
}

/**
 * Внутри каждой функции есть функция генерации страки таблицы
 * По идее в каждую функцию надо передавать список записей для их рендера
 */

function tableTopHolders({ values, page, total, cbsSupply }, onPageChanged = (page) => {}) {
  const startRank = page * 10;
  const maxPage = Math.ceil(total / 10);

  function tableRow({ rank, avatarUrl, name, creationDate, cbsOwned, percent }) {
    return (
      <div className="info-table__top-holders_table_row">
        <div><span>{ rank }</span></div>
        <div className="profile-container">
          <div className="profile-avatar" style={{ backgroundImage: `url(${ avatarUrl })` }}></div>
          <span>{ name }</span>
        </div>
        <div><span>{ creationDate }</span></div>
        <div><span>{ cbsOwned }</span></div>
        <div><span>{ percent }%</span></div>
      </div>
    )
  }

  return (
    <div className="info-table__top-holders">
      <div className="info-table__top-holders_chart">
        <div className="chart-container">
          <div className="chart-container__label">
            <span id="chart-center-label">TOP 10<br/>HOLDERS</span>
          </div>
          <div id="chart" className="chart-container__chart"></div>
        </div>
      </div>
      <div className="info-table__table-scroll-wrapper">
        <div className="info-table__top-holders_table">
          <div className="info-table__top-holders_table_title-row">
            <div><span>Rank</span></div>
            <div><span>Name</span></div>
            <div><span>Creation</span></div>
            <div><span>CBS OWNED</span></div>
            <div><span>Perectange</span></div>
          </div>
          <div className="info-table__top-holders_table_content">
            {
              values.map((item, i) => {
                let _date = new Date(Date.parse(item.creation_date))
                const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
                return tableRow({
                  rank: startRank + i + 1,
                  avatarUrl: '',
                  name: item.name,
                  creationDate: `${_date.getDate()} ${monthNames[_date.getMonth()]} ${_date.getFullYear(-2)}`,
                  cbsOwned: Api.cbsfmt(item.cbs_balance),
                  percent: item.name === 'cbs' ? '- ' :  Api.percent(Api.cbsfmt(item.cbs_balance), cbsSupply) * 100,
                })
              })
            }
          </div>
          {/* 
            Не стал переность пагинацию из кошелька ._.
          */}
          {createPagination(maxPage, page,  onPageChanged)}
        </div>
      </div>
    </div>
  ) 
}

function createPagination(pagesCount, page, onClick) {
  let items = [];
  
  if (page > 0) {
    items.push(<span onClick={() => onClick(page - 1)} key={items.length}>{ '<' }</span>)
  } else {
    items.push(<span key={items.length}>{ '<' }</span>)
  }

  if (pagesCount < 5) {
    for (let i = 0; i < pagesCount; i++) {
      items.push(<span onClick={() => onClick(i)} key={items.length} className={i === page ? 'pagination__active' : null}>{i + 1}</span>)
    }
  } else {
    items.push(<span onClick={() => onClick(0)} key={items.length} className={0 === page ? 'pagination__active' : null}>1</span>)
    if (page < 3) {
      items.push(<span onClick={() => onClick(1)} key={items.length} className={1 === page ? 'pagination__active' : null}>2</span>)
      items.push(<span onClick={() => onClick(2)} key={items.length} className={2 === page ? 'pagination__active' : null}>3</span>)

      if (page === 2) items.push(<span onClick={() => onClick(3)} key={items.length} className={3 === page ? 'pagination__active' : null}>4</span>)
    } else { 
      items.push(<span>...</span>);
      items.push(<span onClick={() => onClick(page-1)} key={items.length}>{page}</span>)
      items.push(<span onClick={() => onClick(page)} key={items.length}  className={'pagination__active'}>{page+1}</span>)
    }

    if (pagesCount - page > 2) {
          if (page >= 3) {
          items.push(<span onClick={() => onClick(page+1)} key={items.length}>{page+2}</span>);
          }
          
          if (page < pagesCount-3) items.push(<span>...</span>);
          items.push(<span onClick={() => onClick(pagesCount-1)} key={items.length} className={pagesCount-1 === page ? 'pagination__active' : null}>{pagesCount}</span>)
      } else if (page !== pagesCount-1) {
          items.push(<span onClick={() => onClick(pagesCount-1)} key={items.length}> className={pagesCount-1 === page ? 'pagination__active' : null}{pagesCount}</span>)
      }
  }

  if (page < pagesCount-1) {
      items.push(<span onClick={() => onClick(page + 1)} key={items.length}>{ '>' }</span>)
  } else {
      items.push(<span key={items.length}>{ '>' }</span>)
  }
  
  return (
    <div className="info-table__table_pagination">
      {items}
    </div>
  )
}

function tableTopStacked({ values, page, total, cbsSupply }, onPageChanged = (page) => {}) {
  const startRank = page * 10;
  const maxPage = Math.ceil(total / 10);

  function tableRow({ rank, avatarUrl, name, cpu, net, total }) {
    return (
      <div className="info-table__top-staked_table_row">
        <div><span>{ rank }</span></div>
        <div className="profile-container">
          <div className="profile-avatar" style={{ backgroundImage: `url(${ avatarUrl })` }}></div>
          <span>{ name }</span>
        </div>
        <div><span>{ cpu }</span></div>
        <div><span>{ net }</span></div>
        <div><span>{ total }</span></div>
      </div>
    )
  }

  return (
    <div className="info-table__table-scroll-wrapper">
      <div className="info-table__top-staked">
        <div className="info-table__top-staked_table">
          <div className="info-table__top-staked_table_title-row">
            <div><span>Rank</span></div>
            <div><span>Name</span></div>
            <div><span>CPU (CBS)</span></div>
            <div><span>NET (CBS)</span></div>
            <div><span>TOTAL (CBS)</span></div>
          </div>
          <div className="info-table__top-staked_table_content">
            {values.map((item, i) => tableRow({
              rank: startRank + i + 1,
              avatarUrl: '',
              name: item.name,
              cpu: Api.cbsfmt(item.cpu),
              net: Api.cbsfmt(item.net),
              total: Api.cbsfmt(item.staked),
            }))}
          </div>
          {/* 
            Не стал переность пагинацию из кошелька ._.
          */}
          {createPagination(maxPage, page,  onPageChanged)}
        </div>
      </div>
    </div>
  )
}

function tableTopUnstacked({ values, page, total, cbsSupply }, onPageChanged = (page) => {}) {
  const startRank = page * 10;
  const maxPage = Math.ceil(total / 10);

  function tableRow({ rank, avatarUrl, name, total }) {
    return (
      <div className="info-table__top-unstaked_table_row">
        <div><span>{ rank }</span></div>
        <div className="profile-container">
          <div className="profile-avatar" style={{ backgroundImage: `url(${ avatarUrl })` }}></div>
          <span>{ name }</span>
        </div>
        <div><span>{ total }</span></div>
      </div>
    )
  }

  return (
    <div className="info-table__table-scroll-wrapper">
      <div className="info-table__top-unstaked">
        <div className="info-table__top-unstaked_table">
          <div className="info-table__top-unstaked_table_title-row">
            <div><span>Rank</span></div>
            <div><span>Name</span></div>
            <div><span>TOTAL UNSTACKED (CBS)</span></div>
          </div>
          <div className="info-table__top-unstaked_table_content">
            {values.map((item, i) => tableRow({
              rank: startRank + i + 1,
              avatarUrl: '',
              name: item.name,
              total: Api.cbsfmt(item.unstaked),
            }))}
          </div>
          {/* 
            Не стал переность пагинацию из кошелька ._.
          */}
          {createPagination(maxPage, page,  onPageChanged)}
        </div>
      </div>
    </div>
  )
}

function tableTopRAM({ values, page, total, cbsSupply }, onPageChanged = (page) => {}) {
  const startRank = page * 10;
  const maxPage = Math.ceil(total / 10);

  function tableRow({ rank, avatarUrl, name, total }) {
    return (
      <div className="info-table__top-ram_table_row">
        <div><span>{ rank }</span></div>
        <div className="profile-container">
          <div className="profile-avatar" style={{ backgroundImage: `url(${ avatarUrl })` }}></div>
          <span>{ name }</span>
        </div>
        <div><span>{ total }</span></div>
      </div>
    )
  }

  return (
    <div className="info-table__table-scroll-wrapper">
      <div className="info-table__top-ram">
        <div className="info-table__top-ram_table">
          <div className="info-table__top-ram_table_title-row">
            <div><span>Rank</span></div>
            <div><span>Name</span></div>
            <div><span>TOTAL RAM (MB)</span></div>
          </div>
          <div className="info-table__top-ram_table_content">
            { values.map((item, i) => tableRow({
              rank: startRank + i + 1,
              avatarUrl: '',
              name: item.name,
              total: Api.memfmt(item.ram),
            })) }
          </div>
          {/* 
            Не стал переность пагинацию из кошелька ._.
          */}
          {createPagination(maxPage, page,  onPageChanged)}
        </div>
      </div>
    </div>
  )
}