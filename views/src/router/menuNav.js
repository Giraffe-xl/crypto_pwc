// 路由地址对应左侧导航的index
let navConfig = {
    'index' : '0',
    'Client Management':1,
    'Address Management':2,
    'Address Validation':3,
    };
    
    function getActiveNav(href) {
    console.log(href);
    let key = href.split('/root/')[1];
    console.log();
    return navConfig[key];
    };
    
    export default getActiveNav;