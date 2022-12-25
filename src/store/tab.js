export default {
    state: {
        //用于控制菜单的展开还是收起的状态
        isCollapse: false,
        //面包屑的数据
        tabsList: [
            {
                path: "/home",
                name: "home",
                label: "首页",
                icon: "s-home",
                url: "Home/Home",
            },
        ],
        // 动态菜单
        menuData: [
        ],
    },
    //修改字段
    mutations: {
        //修改控制菜单展开或者收起的方法
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse;
        },
        // 更新面包屑数据
        selectMenu(state, val) {
            console.log(val, 'val')
            // 判断添加的数据是否存在
            const index = state.tabsList.findIndex(item => item.name === val.name)
            if (index === -1) {
                state.tabsList.push(val)
            }
        },
        //删除面包屑的数据
        closeTag(state, item) {
            console.log(item, 'item')
            const index = state.tabsList.findIndex(val => val.name === item.name)
            state.tabsList.splice(index, 1)
        },
        //设置menu的数据
        setMenu(state, val) {
            console.log(val, 'val')
            state.menuData = val
            console.log(state.menuData, 'menu')
        },
        //动态注册路由
        addMenu(state, router) {
            // 处理动态路由的数据
            const menuArray = []
            state.menuData.forEach(item => {
                if (item.children) {
                    item.children = item.children.map(item => {
                        item.component = (resolve) => require([`@/views/home/${item.url}`], resolve)
                        return item
                    })
                    menuArray.push(...item.children)
                } else {
                    item.component =  (resolve) => require([`@/views/home/${item.url}`], resolve)
                    menuArray.push(item)
                }
            })
            console.log(menuArray, 'menuArray')
            // 路由的动态添加
            menuArray.forEach(item => {
                router.addRoute('main', item)
            })
        },
        //清空state
        clear(state){
            for(let i in state){
                delete state[i]
            }
        }
    }
}