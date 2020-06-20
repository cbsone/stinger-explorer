import React, {Component} from 'react'

import {
    Switch,
    Route,
    Link,
    withRouter
} from "react-router-dom"
import cx from 'classnames'

import './assets/Gilroy/Gilroy-Regular.eot'
import './assets/Gilroy/Gilroy-Regular.woff'
import './assets/Gilroy/Gilroy-Medium.eot'
import './assets/Gilroy/Gilroy-Medium.woff'
import './assets/Gilroy/Gilroy-Bold.eot'
import './assets/Gilroy/Gilroy-Bold.woff'

import './App.css'
import * as Api from './api/api'

import { ReactComponent as HeaderLogo } from "./assets/svg/header-logo.svg"
import { ReactComponent as MenuIcon } from "./assets/svg/menu-icon.svg"
import logo from "./assets/svg/header-logo.svg"
import smallLogo from './assets/svg/header-logo-small.svg'
import InfoPage from './pages/InfoPage/InfoPage'
import AccountsPage from './pages/AccountsPage/AccountsPage'
import AccountView from './pages/AccountsPage/AccountView'
import BlocksPage from './pages/BlocksPage/BlocksPage'
import BlockView from './pages/BlocksPage/BlockView'
import TransactionsPage from './pages/TransactionsPage/TransactionsPage'
import TransactionView from './pages/TransactionsPage/TransactionView'
import ValidatorsPage from './pages/ValidatorsPage/ValidatorsPage'
// import ComingSoon from './pages/ComingSoon/ComingSoon'
import Preloader from './pages/Preloader/Preloader'
import Notifications, { notify } from 'react-notify-toast'

window.api = Api;
window.notify = notify;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloaded: false,
            menuOpened: false
        }
    }

    buildSteps(path) {
        if (path === '/') return (<Link to='/'>Info</Link>)

        let _steps = path.split('/')
        let steps = []
        let _path = ''

        _steps.forEach(item => {
            if (item === '') return

            _path += `/${ item }`

            let pageName = ''
            switch (_path) {
                case '/blocks/view':
                    pageName = 'Block Detail'
                    break;
            
                case '/transactions/view':
                    pageName = 'Transactions Detail'
                    break;

                default:
                    pageName = item
                    break;
            }

            steps.push(<Link to={ _path } key={ steps.length}>{ pageName }</Link>)
            steps.push(
                <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none"  key={ steps.length}>
                    <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
                </svg>
            )
        })
        steps.pop()

        return steps
    }

    toggleMenu = () => {
        this.setState(({ menuOpened }) => ({
                menuOpened: !menuOpened
        }))
    };

    componentDidMount() {
        const { history } = this.props;

        this.unlisten = history.listen((location, action) => {
            this.setState({
                menuOpened: false
            })
        });
    }

    componentWillUnmount() {
        this.unlisten()
    }

    render() {
        const { location: { pathname } } = this.props;
        const { menuOpened } = this.state;

        return <div className="app">
            <Notifications options={{zIndex: 200}}/>
            {
                !this.state.preloaded ? <Preloader onLoad={ () => this.setState({ preloaded: true }) }/> : null
            }
                <main>
                    <div className={ cx('side-menu', { 'side-menu--active':  menuOpened}) }>
                        <Link className="side-menu__logo" to="/"><HeaderLogo /></Link>
                        <img className="side-menu__logo--small" src={ smallLogo } alt=""/>
                        <div className="side-nav">
                            <Link className={ cx('side-nav__link', { 'side-nav__link-active': pathname === '/' }) } to="/">
                                <div className="side-nav__link_icon nav-info-icon"></div>
                                <span>Info</span>
                            </Link>
                            <Link className={ cx('side-nav__link', { 'side-nav__link-active': pathname === '/blocks' }) } to="/blocks">
                                <div className="side-nav__link_icon nav-blocks-icon"></div>
                                <span>Blocks</span>
                            </Link>
                            <Link className={ cx('side-nav__link', { 'side-nav__link-active': pathname === '/transactions' }) } to="/transactions">
                                <div className="side-nav__link_icon nav-transactions-icon"></div>
                                <span>Transactions</span>
                            </Link>
                            <Link className={ cx('side-nav__link', { 'side-nav__link-active': pathname === '/validators' }) } to="/validators">
                                <div className="side-nav__link_icon nav-validators-icon"></div>
                                <span>Validators</span>
                            </Link>
                            <Link className={ cx('side-nav__link', { 'side-nav__link-active': pathname === '/accounts' }) } to="/accounts">
                                <div className="side-nav__link_icon nav-ambass-icon"></div>
                                <span>Accounts</span>
                            </Link>
                        </div>
                    </div>
                    <div className="content">
                        <header className="app-header">
                            <img src={ logo } alt="" />
                            <button onClick={ this.toggleMenu } className="app-header__btn-menu">
                                <MenuIcon/>
                            </button>
                        </header>
                        <div className="page-header">
                            {/* 
                                Дима, это место для последовательности открытых экранов
                                Пример: "Accounts   •   Account name"
                                я хз как правильно его выстраивать
                                
                                стили подразумевают последовательность элементов,
                                к примеру:

                                    первый экран, к примеру Accounts
                                    <Link ></Link>

                                    точка-разделитель
                                    <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                        <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
                                    </svg>

                                и далее такой парой

                                Блоки отцентрированы, отступы заданы. Все в App.css
                                По всем вопросам - сразу ко мне

                                ---

                                После прочтения сжечь

                                ---

                                Я разобрался и запили
                                В любом случае чекни говнокоды на адекватность
                            */}
                            { this.buildSteps(pathname) }
                        </div>
                        <Switch>
                            <Route path="/" exact>
                                <InfoPage/>
                            </Route>
                            <Route path="/blocks" exact>
                                 <BlocksPage/>
                            </Route>
                            <Route path="/block/:id_or_num" exact component={BlockView}/>
                            <Route path="/transactions" exact>
                                 <TransactionsPage/>
                            </Route>
                            <Route path="/transaction/:id" exact component={TransactionView}/>
                            <Route path="/validators" exact>
                                 <ValidatorsPage/>
                            </Route>
                            <Route path="/accounts" exact>
                                 <AccountsPage/>
                            </Route>
                            <Route path="/account/:accountName" exact component={AccountView} />
                        </Switch>
                    </div>
                </main>
                <footer>
                    <a href="https://wallet.cbs.io" rel="noopener noreferrer"  target="_blank">Wallet CBS</a>
                    <a href="http://cbs.io" rel="noopener noreferrer"  target="_blank">CBS</a>
                </footer>
        </div>
    }
}

export default withRouter(App)