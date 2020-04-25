import './Header.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {  Nav, NavItem } from 'reactstrap';
//import { AppNavbarBrand } from '@coreui/react';
import styled from 'styled-components';

import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';

import ConnectionIndicator from './components/ConnectionIndicator';

const EosioLogoSmallSVG = ({className}) =>
  <svg {...{className}} width="70" height="66" viewBox="0 0 70 66" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28.1078 5.19998V14.5L33.5898 19.9999V23.2999C32.5931 23.6999 31.7957 24.5999 31.7957 25.7999C31.7957 27.2999 32.9918 28.4999 34.4868 28.4999C35.9819 28.4999 37.178 27.2999 37.178 25.7999C37.178 24.5999 36.4803 23.6999 35.3839 23.2999V19.9999L40.0685 15.3V5.19998C41.0653 4.79998 41.8626 3.89999 41.8626 2.69999C41.8626 1.19999 40.6666 0 39.1715 0C37.6764 0 36.4803 1.19999 36.4803 2.69999C36.4803 3.89999 37.178 4.79998 38.2744 5.19998V14.5L34.3872 18.3999L29.8022 13.8V5.19998C30.7989 4.79998 31.5963 3.89999 31.5963 2.69999C31.5963 1.19999 30.4002 0 28.9052 0C27.4101 0 26.214 1.19999 26.214 2.69999C26.3137 3.79999 27.1111 4.79998 28.1078 5.19998Z" fill="#FF6E1D"/>
    <path d="M24.5196 52.8998C24.5196 51.3998 23.3235 50.1998 21.8284 50.1998C21.5294 50.1998 21.33 50.2999 21.031 50.2999L16.3464 43.7999L23.5228 34.1999V26.4999L19.3365 19.4999H10.2663V19.5999L10.5653 19.9999L10.366 19.4999L3.48855 28.4999C3.18953 28.3999 2.9902 28.3999 2.69118 28.3999C1.19609 28.3999 0 29.5999 0 31.0999C0 32.5999 1.19609 33.7999 2.69118 33.7999C4.18628 33.7999 5.38233 32.5999 5.38233 31.0999C5.38233 30.5999 5.18299 29.9999 4.98365 29.5999L11.2631 21.1999L13.9542 25.5999L11.6617 28.7999C11.4624 28.7999 11.3627 28.7999 11.1634 28.7999C9.66829 28.7999 8.4722 29.9999 8.4722 31.4999C8.4722 32.9999 9.66829 34.1999 11.1634 34.1999C12.6585 34.1999 13.8545 32.9999 13.8545 31.4999C13.8545 30.7999 13.6552 30.1999 13.2565 29.7999L15.4493 26.6999H21.928V33.7999L14.3529 43.8999L19.8349 51.3998C19.5359 51.7998 19.4362 52.2998 19.4362 52.8998C19.4362 54.3998 20.6323 55.5998 22.1274 55.5998C23.6225 55.5998 24.5196 54.2998 24.5196 52.8998Z" fill="#FF6E1D"/>
    <path d="M46.3479 60.6C45.7499 60.6 45.2515 60.8 44.7532 61.1L35.5833 55.7V50.4L43.5571 44.2001H25.616L33.8888 50.6V55.7L24.7189 61.1C24.3202 60.8 23.7222 60.6 23.1241 60.6C21.629 60.6 20.433 61.8 20.433 63.3C20.433 64.8 21.629 66 23.1241 66C24.6192 66 25.8153 64.8 25.8153 63.3C25.8153 63.1 25.8153 62.8 25.7156 62.6L34.7859 57.3L43.8561 62.6C43.7564 62.8 43.7564 63 43.7564 63.3C43.7564 64.8 44.9525 66 46.4476 66C47.9427 66 49.1388 64.8 49.1388 63.3C49.0391 61.7 47.843 60.6 46.3479 60.6Z" fill="#FF6E1D"/>
    <path d="M66.3822 28.6001C66.0832 28.6001 65.8838 28.7001 65.5848 28.7001L58.7074 19.7001L58.508 20.2001L58.807 19.8001V19.7001H49.7368L45.5506 26.7001V34.4001L52.727 44.0001L48.0424 50.5C47.7434 50.4 47.544 50.4 47.245 50.4C45.7499 50.4 44.5538 51.6 44.5538 53.1C44.5538 54.6 45.7499 55.8 47.245 55.8C48.7401 55.8 49.9362 54.6 49.9362 53.1C49.9362 52.6 49.7368 52 49.5375 51.6L55.0195 44.1001L47.4443 34.0001V26.7001H53.9231L56.1159 29.8001C55.7172 30.3001 55.5178 30.9001 55.5178 31.5001C55.5178 33.0001 56.7139 34.2001 58.209 34.2001C59.7041 34.2001 60.9002 33.0001 60.9002 31.5001C60.9002 30.0001 59.7041 28.8001 58.209 28.8001C58.0097 28.8001 57.91 28.8001 57.7106 28.8001L55.4182 25.6001L58.1093 21.2001L64.3887 29.6001C64.0897 30.0001 63.99 30.5001 63.99 31.1001C63.99 32.6001 65.1861 33.8001 66.6812 33.8001C68.1763 33.8001 69.3724 32.6001 69.3724 31.1001C69.0734 29.8001 67.8773 28.6001 66.3822 28.6001Z" fill="#FF6E1D"/>
  </svg>

const StyledEosioLogoSmallSVG = styled(EosioLogoSmallSVG)`
  width: auto;
  height: 48px;
  display: block;
`;

const NavWrapper = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 40px;
  padding: 0 0 0 10px;
  :nth-child(1){
    flex: 1.5 0 0;
  }
  :nth-child(2){
    flex: 5 0 0;
    .last-item{
      padding-right: 0 !important;
      flex: none;
    }
    @media screen and (max-width: 1280px){
      flex: 4 0 0;
    }
    @media screen and (max-width: 1120px){
      .last-item{
        flex: 0 1 0;
      }
    }

  }
  :nth-child(3){
    flex: 0.4 1 0;
    padding: 0;
    @media screen and (max-width: 1280px){
      flex: 0.1 1 0;
    }
  }
  :nth-child(4){
    flex: 3 0 0;
    .px-3{
      flex: none;
      padding-right: 0 !important;
    }
    @media screen and (max-width: 1280px){
      flex: 2.7 0 0;
      .px-3{
        padding-right: 0 !important;
      }
    }
    @media screen and (max-width: 1120px){
      flex: 2 0 0;
      .px-3{
        flex: 0 1 0;
      }
    }

  }
  :nth-child(5){
    flex: 0.3 0 0;
    @media screen and (max-width: 1280px){
      padding: 0;
    }
  }
  :nth-child(6){
    flex: 0.6 0 0;
    padding: 0;
    .px-3{
      padding-right: 0 !important;
    }
    @media screen and (max-width: 1120px){
      padding-right: 10px;
      .px-3{
        padding-right: 1rem !important;
      }
    }

  }
`

const NavWrapperRow = styled(NavWrapper)`
  flex-direction: row;
  justify-content: space-around;
`

const NavHead = styled.div`
  font-size: 9px;
  color: #bcbcbc;
  padding-top: 1px;
`

const VerticalLine = styled.div`
  height: 40px;
  width: 1px;
  margin: auto 0;
  background-color: #e8ebf0;
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`

const AppName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 4px;
  line-height: 1;
  color:#443f54;
  font-weight: normal;
  height: 40px;
  font-weight: 500;
  text-align: left;
  >div{
    &:first-child{
      font-size: 11px;
      margin-top: 2.5px;
      sub{
        font-size: 25%;
      }
    }
    &:last-child{
      font-size: 16px;
      margin-bottom: 1.5px;
    }
  }
`

const WrappedLink = styled(Link)`
  display: flex;
  color: inherit;
  :hover{
    text-decoration: none;
    color: inherit;
  }
`
const NavStyled = styled(Nav)`
  padding-top: 10px;
`

const matchPath = (pathname, path) => {
  let splitArr = pathname.split("/");
  if(splitArr.find(el => el === path)){
    return true;
  }else{
    return false;
  }
}

const Header = (props) => {

  let { router: { location: {pathname} }, panelSelect } = props;

  return (
    <div className="Header">
        <NavWrapper>
          <WrappedLink to={`/`}>
            <Nav className="nav-items d-md-down-none" navbar>
              <LogoWrapper>
                <StyledEosioLogoSmallSVG/>
                <AppName>
                  <div>Cbs One<sub></sub></div>
                  <div>Stinger Explorer</div>
                </AppName>
              </LogoWrapper>
            </Nav>
          </WrappedLink>
        </NavWrapper>
        <NavWrapper>
          <NavHead>INSPECT</NavHead>
          <NavStyled className="nav-items d-md-down-none" navbar>
            <NavItem className="px-3">
              <Link to={`/`} className={`nav-link ${pathname === `/` ? `active` : ``}`}>INFO</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/block-list`} className={`nav-link ${pathname === `/block-list` || pathname === `/block-list/` || matchPath(pathname, 'block') ? `active` : ``}`}>BLOCKS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/transaction-list`} className={`nav-link ${pathname === `/transaction-list` || pathname === `/transaction-list/` || matchPath(pathname, 'transaction') ? `active` : ``}`}>TRANSACTIONS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/action-list`} className={`nav-link ${pathname === `/action-list` || pathname === `/action-list/` || matchPath(pathname, 'action') ? `active` : ``}`}>ACTIONS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/account`} className={`nav-link ${pathname === `/account` || matchPath(pathname, 'account') ? `active` : ``}`}>ACCOUNTS</Link>
            </NavItem>
            <NavItem className="px-3 last-item">
              <Link to={`/contract`} className={`nav-link ${pathname === `/contract` || matchPath(pathname, 'contract') ? `active` : ``}`}>SMART CONTRACT</Link>
            </NavItem>
          </NavStyled>
        </NavWrapper>
        <NavWrapper></NavWrapper>
        <NavWrapper>
          <NavHead>INTERACT</NavHead>
          <NavStyled className="nav-items d-md-down-none" navbar>
            <NavItem className="px-3">
              <Link onClick={()=>panelSelect("permission-list")} to={`/permission`} className={`nav-link ${pathname === `/permission` || pathname === `/permission/` ? `active` : ``}`}>MANAGE ACCOUNTS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/deploy`} className={`nav-link ${pathname === `/deploy` || pathname === `/deploy/` ? `active` : ``}`}>DEPLOY CONTRACTS</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to={`/push-action`} className={`nav-link ${pathname === `/push-action` || pathname === `/push-action/` ? `active` : ``}`}>PUSH ACTIONS</Link>
            </NavItem>
          </NavStyled>
        </NavWrapper>
        <NavWrapperRow>
          <VerticalLine>&nbsp;</VerticalLine>
        </NavWrapperRow>
        <NavWrapperRow>
          <Nav className="nav-items d-md-down-none" navbar>
            <NavItem className="px-3">
              <ConnectionIndicator/>
            </NavItem>
          </Nav>
        </NavWrapperRow>
        <div style={{display:"none"}}>
          <Link to={`/page-not-found`} ></Link>
        </div>
    </div>
  )
}

export default connect(
  ({router}) => ({
    router
  }),
  {
    panelSelect
  }

)(Header);
