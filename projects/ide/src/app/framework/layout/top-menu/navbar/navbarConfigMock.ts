import { MenuItem, Lvl1MenuItem } from './menu';
export const menus = {
  'context-menu': {
    'atom-text-editor': [
      {
        'label': 'Toggle sagipackage',
        'command': 'sagipackage:toggle'
      }
    ]
  },
  'menu': [
    {
      'label': '文件',
      'submenu': [
        {
          'label': '新建',
          'submenu': [
            {
              'label': 'GSP工程',
              'command': 'newProject'
            },
            {
              'label': '元数据',
              'command': 'newMetadata'
            },
            {
              'label': '数据库对象',
              'command': 'newDbo'
            },
            {
              'label': '目录',
              'command': 'newFolder'
            }
          ]
        },
        {
          'label': '导入工程',
          'command': 'newProjectImport'
        },
        {
          'label': '设置',
          'submenu': [
            {
              'label': '初始开发目录',
              'command': 'InitDevRootPath'
            }
          ]
        },
        {
          'label': '删除工程',
          'command': 'deleteProject'
        },
      ]
    },
    {
      'label': '工程',
      'submenu': [
        {
          'label': '元数据包管理',
          'command': 'metadataPackageManager'
        }
        // {
        //   'label': '工程属性',
        //   'command': 'ProjectProperty'
        // },
      ]
    },
    {
      'label': '生成',
      'submenu': [
        {
          'label': '打包',
          'command': 'pack'
        },
        { 'label': '编译',
          'command': 'projectCompile'
        },
        { 'label': '提取',
          'command': 'projectExtract'
        },
        { 'label': '部署',
          'command': 'projectDeploy'
        },
        { 'label': '推送',
          'command': 'metadataPackagePush'
        },
        {
          'label': '拉取最新元数据包',
          'command': 'updateAllRefs'
        },
        {
          'label': '预编译',
          'command': 'webIDEPreBuild'
        }
      ]
    },
    {
      'label': '调试',
      'submenu': [
        {
          'label': '一键部署',
          'command': 'clickOnceToDeploy'
        },
        {
          'label': '启动服务',
          'command': 'startDebugService'
        },
        {
          'label': '停止服务',
          'command': 'stopDebugService'
        }
      ]
    },
    {
      'label': '关于',
      'submenu': [
        {
          'label': 'what\' s new?',
          'command': 'welcomePage'
        }
      ]
    }
  ]
};

export class NavbarConfigMock {

  // constructor() {}
  getMenusConfig(): Lvl1MenuItem[] {
    return menus.menu;
  }
}
