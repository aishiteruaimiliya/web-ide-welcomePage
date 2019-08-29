import { CacheService } from './../../services/cache/services/cache.service';
import { CommandRegistry } from './command-registry';
import { EventBus } from '../eventbus/event-bus';
import { Util } from '../util/util';
import { ViewRegistry } from './view-registry';
import { Workspace } from './workspace';
import { GspEventBus } from './gsp-event-bus';
import { Ide } from './ide/ide';

export class GSP {
  private pEventBus: EventBus;
  private pUtil: Util;
  private pWorkspace: Workspace;
  private pConfig: any;
  private pViews: ViewRegistry;
  private pCommands: CommandRegistry;
  private pIde: Ide;
  private pCache: CacheService;

  get eventBus(): EventBus { return this.pEventBus; }
  get util(): Util { return this.pUtil; }
  get workspace(): Workspace { return this.pWorkspace; }
  get views(): ViewRegistry { return this.pViews; }
  get commands(): CommandRegistry { return this.pCommands; }
  get ide(): Ide { return this.pIde; }
  get cache(): CacheService { return this.pCache; }

  constructor(parent?: GSP) {
    this.pConfig = {
      get(key) {
        return this[key];
      }
    };
    let ide: Ide;
    if (parent) {
      this.pViews = parent.views;
      this.pCommands = parent.commands;
      this.pEventBus = parent.eventBus;
      this.pUtil = parent.util;
      this.pWorkspace = parent.workspace;
      this.pCache = parent.cache;
      ide = parent.ide;
    } else {
      this.pViews = new ViewRegistry(this);
      this.pCommands = new CommandRegistry();
      this.pEventBus = new GspEventBus();
      this.pUtil = new Util();
      this.pWorkspace = new Workspace({
        config: this.pConfig,
        viewRegistry: this.pViews
      });
      this.pCache = new CacheService(null);
    }
    this.pIde = new Ide(ide);
  }

  /**
   * @deprecated 由子模块独自创建gsp实例，传入父实例作为参数。
   * 每个iframe持有一个独有的gsp实例，其中eventbus共享，ide不共享
   */
  createChild() {
    const child = new GSP(this);
    // child.pEventBus = this.pEventBus;
    // child.pViews = this.pViews;
    // child.pWorkspace = this.pWorkspace;
    return child;
  }
}
