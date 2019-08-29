# IDE中获取SessionId

需要获取sessionId的类中注入CacheService服务。使用CacheService.get方法获取sessionId。示例代码如下。
CacheService的引用路径暂为：'src/app/cache'。


export class TestComponent {
  constructor(..., private cache: CacheService) {}

  test() {
​    const sessionId = this.cache.get('sessionId');
  }
}