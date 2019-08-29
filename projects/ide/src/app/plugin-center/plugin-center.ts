import { PluginConfigService } from './plugin-config.service';
import { MainComponent } from '../framework/layout/main/main.component';
import { IPlugin, IMetaOpener } from './plugin';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * 插件注册中心。
 * 应该由服务器端提供插件的注册情况。
 * A记插件package.json中有可选属性activateCommand。
 * 若标记了此属性，该插件在命令被触发时异步加载，否则在打开App时加载。
 * IDE插件也区分是否需要有ActivateCommand：
 * 1、 有ActivateCommand，在触发命令时下载；
 * 2、 无激活命令
 *      元数据设计器，注册每种元数据的url。打开元数据前下载（异步打开），需要提供对应的文件后缀
 * 3、 BO树、文件树等，打开IDE下载——BO树立即下，文件树后台下？
 */
@Injectable()
export class PluginCenter {
  
  private mainCmp: MainComponent;
  private plugins: IPlugin[];
  private openers: IMetaOpener[];
  
  constructor(private pluginService: PluginConfigService) {
    this.openers = [];
  }

  registryPlugin(mainCmp: MainComponent): Observable<any> {
    this.mainCmp = mainCmp;
    return this.pluginService.getConfig().pipe(
      tap(data => {
        for (const plugin of data.eager) {
          this.addPluginToWorkspace(plugin);
        }
        for (const plugin of data.lazy) {
          this.listenCommandForPlugin(plugin);
        }
        for (const plugin of data.editor) {
          this.addOpener(plugin);
        }
      })
    );
  }

  private addPluginToWorkspace(plugin: any) {
    switch (plugin.location) {
      case 'left':
        // this.mainCmp.sidebar.loadPanel(plugin.title, plugin);
        gsp.ide.addPanel(plugin);
        break;
      case 'right':
        break;
      case 'modal':
        // this.modalPanel.add(plugin);
        break;
      default:
        break;
    }
  }

  private listenCommandForPlugin(plugin: any) {
    // const gspEventBus = gsp.eventBus as GspEventBus;
    // gspEventBus.registryActivateCommand(plugin.activationCommands, plugin, this.addPluginToWorkspace.bind(this));
    plugin.frameID = gsp.util.newGuid();
    const commandsStr = plugin.activationCommands;
    const commands = [];
    if (typeof(commandsStr) === 'string') {
      commands.push(commandsStr);
    } else {
      for (const command of commandsStr) {
        commands.push(command);
      }
    }
    for (const command of commands) {
      gsp.eventBus.on(null, null, command, this, (data) => {
        plugin.command = command;
        gsp.ide.addModal(plugin);

        gsp.ide.setInitCommandData(plugin.frameID, data); // workspace添加plugin的时候会给plugin对象添加frameID属性
      });
    }
  }

  private addOpener(plugin: any) {
    const sufs = [];
    const editor = plugin.editor;
    if (typeof(editor) === 'string') {
      sufs.push(editor);
    } else if (editor instanceof Array) {
      editor.forEach(item => sufs.push(item));
    }

    // const opener: IMetaOpener = {
    //   name: plugin.title,
    //   prefix: plugin.editor,
    //   target: 'root',
    //   uri: suffix
    // };

    gsp.workspace.addFrmOpener((uri: string) => {
      const suffix = uri.substr(uri.lastIndexOf('.'));
      if (sufs.find(item => item === suffix)) {
        return {
          getTitle: () => uri.substr(uri.lastIndexOf('/') + 1),
          elementUrl: plugin.url + '?id=' + uri
        };
      }
    });
  }
}
