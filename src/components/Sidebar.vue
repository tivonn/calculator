<script>
export default {
  name: 'Sidebar',

  // 侧边栏目前为静态页面，没有逻辑交互，所以使用函数式组件
  functional: true,

  render (h, context) {
    let calculatorTypes = [
      {
        text: `计算器`,
        modes: [
          {
            icon: `icon-biaozhun`,
            text: `标准`
          },
          {
            icon: `icon-kexue`,
            text: `科学`
          },
          {
            icon: `icon-chengxuyuan`,
            text: `程序员`,
            active: true
          },
          {
            icon: `icon-riqijisuan`,
            text: `日期计算`
          }
        ]
      },
      {
        text: `转换器`,
        modes: [
          {
            icon: `icon-huobi`,
            text: `货币`
          },
          {
            icon: `icon-tiji`,
            text: `体积`
          },
          {
            icon: `icon-changdu`,
            text: `长度`
          },
          {
            icon: `icon-zhongliang`,
            text: `重量`
          },
          {
            icon: `icon-wendu`,
            text: `温度`
          },
          {
            icon: `icon-nengliang`,
            text: `能量`
          },
          {
            icon: `icon-mianji`,
            text: `面积`
          },
          {
            icon: `icon-sudu`,
            text: `速度`
          },
          {
            icon: `icon-shijian`,
            text: `时间`
          },
          {
            icon: `icon-gonglv`,
            text: `功率`
          },
          {
            icon: `icon-shuju`,
            text: `数据`
          },
          {
            icon: `icon-yali`,
            text: `压力`
          },
          {
            icon: `icon-jiaodu`,
            text: `角度`
          }
        ]
      }
    ]

    // 创建计算器类型节点
    let createTypes = (types) => {
      let typeList =
      <ul class="type-list">
        { types.map(type => {
          let typeEl =
            <li class="type-item">
              <p class="type-text">{ type.text }</p>
              { createModes(type.modes) }
            </li>
          return typeEl
        })}
      </ul>
      return typeList
    }

    // 创建计算器模式节点
    let createModes = (modes) => {
      let modeList =
        <ul class="mode-list">
          { modes.map(mode => {
            let modeEl =
              <li class={['mode-item', mode.active ? 'active' : '']}>
                <i class={['mode-icon', 'iconfont', mode.icon]}></i>
                <span class="mode-text">{ mode.text }</span>
              </li>
            return modeEl
          })}
        </ul>
      return modeList
    }

    return (
      <div class={['sidebar-container', context.props.showSidebar ? 'active' : '']}>
        <p class="close-sidebar">
          <i class="iconfont icon-caidanlan icon-caidanlan-icon" title="关闭导航"></i>
        </p>
        { createTypes(calculatorTypes) }
        <p class="about-calculator">
          <i class="iconfont icon-guanyu"></i>
          <span class="about-text">关于</span>
        </p>
      </div>
    )
  }
}
</script>

<style lang='scss'>
.sidebar-container {
  width: 320px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: -320px;
  z-index: 100;
  background-color: #f2f2f2;
  transition: transform .5s;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  &.active {
    transform: translateX(320px);
  }
  .close-sidebar {
    height: 5vh;
    line-height: 5vh;
  }
  .icon-caidanlan-icon {
    width: 5vh;
    height: 5vh;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #dbdbdb;
    }
  }
  .type-list {
    height: 87vh;
    overflow: auto;
  }
  .type-text {
    height: 6vh;
    padding-left: 20px;
    line-height: 6vh;
    font-weight: bold;
  }
  .mode-item {
    height: 5vh;
    padding-left: 20px;
    line-height: 5vh;
    border-left: 3px solid #e2e8e6;
    cursor: pointer;
    &:hover {
      background-color: #dbdbdb;
    }
    &.active {
      border-color: #409eff;
    }
  }
  .mode-text {
    margin-left: 10px;
  }
  .about-calculator {
    height: 5vh;
    margin-top: 2vh;
    padding-left: 20px;
    line-height: 5vh;
    cursor: pointer;
    &:hover {
      background-color: #dbdbdb;
    }
  }
  .about-text {
    margin-left: 10px;
  }
}
</style>
