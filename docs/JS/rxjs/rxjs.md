

#### 四种 Subject 类型对比

| 类型                | 核心特性                                                     | 适用场景                     |
| ------------------- | ------------------------------------------------------------ | ---------------------------- |
| **Subject**         | 纯粹的多播 Observable，不存储历史值，新订阅者只能收到订阅后的新值 | 实时事件通知、简单的消息传递 |
| **BehaviorSubject** | 必须指定初始值，始终保存最新值，新订阅者会立即收到最新值     | 状态管理（如用户登录状态）   |
| **ReplaySubject**   | 存储历史值，新订阅者可获取指定数量或时间范围内的历史数据     | 历史数据回放、缓存数据       |
| **AsyncSubject**    | 只在完成时发送最后一个值，适合处理异步操作的最终结果         | 异步操作完成后的结果通知     |

#### 四、Subject 基本用法示例



# 操作符

1. **创建操作符**：创建新的 Observable（如 `of`, `from`, `interval`）
2. **转换操作符**：转换 Observable 中的值（如 `map`, `pluck`, `scan`）
3. **过滤操作符**：过滤 Observable 中的值（如 `filter`, `take`, `skip`）
4. **组合操作符**：组合多个 Observable（如 `merge`, `concat`, `combineLatest`）
5. **错误处理操作符**：处理 Observable 中的错误（如 `catchError`, `retry`）
6. **工具操作符**：提供各种工具功能（如 `tap`, `delay`, `timeout`）
7. **条件和布尔操作符**：基于条件处理 Observable（如 `takeUntil`, `every`）
8. **数学和聚合操作符**：执行数学和聚合操作（如 `reduce`, `count`）



### map

组合多个 `Observable`

#### `mergeMap`

- 允许同时处理多个内部 Observable
- 不保证输出顺序与输入顺序一致
- 可以通过第二个参数限制并发数
- 适用于需要并行处理的场景，如并发 HTTP 请求

```js
import { of, interval } from 'rxjs';
import { mergeMap, take, delay } from 'rxjs/operators';

// 示例1：简单映射
of(1, 2, 3).pipe(
  mergeMap(value => of(value * 10))
).subscribe(console.log); // 输出: 10, 20, 30

// 示例2：处理异步操作
const source = interval(1000).pipe(take(3));
source.pipe(
  mergeMap(value => 
    of(`结果: ${value}`).pipe(delay(500))
  )
).subscribe(console.log); 
// 输出: 结果: 0, 结果: 1, 结果: 2 (间隔约500ms)

// 示例3：并发处理
const concurrentSource = interval(500).pipe(take(5));
concurrentSource.pipe(
  mergeMap(value => 
    of(value).pipe(
      delay(1000),
      tap(() => console.log(`处理完成: ${value}`))
    ),
    2 // 最大并发数为2
  )
).subscribe();
// 输出: 处理完成: 0, 处理完成: 1, 处理完成: 2, 处理完成: 3, 处理完成: 4
// 注意：0和1同时开始处理，然后2和3，最后是4

```


#### `concatMap`

- 按顺序处理内部 Observable
- 前一个内部 Observable 完成后，才会订阅下一个
- 保证输出顺序与输入顺序一致
- 适用于需要保持顺序的场景，如排队处理任务

#### `switchMap`

- 每当源发出新值时，取消当前内部 Observable 并订阅新的
- 适用于自动完成、搜索建议等需要取消前一个请求的场景

#### `exhaustMap`

- 忽略新的内部 Observable 直到当前完成
- 适用于防止重复提交、忽略重复点击等场景



####  `自定义map: poolingMap`	

```typescript
function poolingMap<T, R>(
  project: (value: T) => Observable<R>,
  poolSize: number
) {
  return (source: Observable<T>): Observable<R> => {
    const pool = new Set<Observable<R>>(); // 任务池，存储正在执行的任务
    const queue: [T, (value: R) => void][] = []; // 等待队列
    
    return new Observable<R>(observer => {
      const subscription = source.subscribe({
        next(value) {
          if (pool.size < poolSize) {
            executeTask(value); // 任务池未满，立即执行
          } else {
            queue.push([value, executeTask]); // 任务池已满，加入队列
          }
        },
        complete() {
          // 所有源值处理完毕，当任务池和队列都为空时完成
          if (pool.size === 0 && queue.length === 0) {
            observer.complete();
          }
        },
        error(err) {
          observer.error(err);
        }
      });
      
      // 执行任务的函数
      function executeTask(value: T) {
        const task$ = project(value);
        pool.add(task$); // 将任务加入任务池
        
        task$.subscribe({
          next(result) {
            observer.next(result);
          },
          complete() {
            pool.delete(task$); // 任务完成，从任务池移除
            
            // 从队列中取出下一个任务执行
            if (queue.length > 0) {
              const [nextValue, callback] = queue.shift()!;
              callback(nextValue);
            } else if (pool.size === 0) {
              observer.complete(); // 任务池和队列都为空，完成 observable
            }
          },
          error(err) {
            observer.error(err);
          }
        });
      }
      
      return subscription;
    });
  };
}
```



####  操作符对比总结

|    操作符    |  并发处理  | 顺序保证 | 取消行为 |          适用场景          |
| :----------: | :--------: | :------: | :------: | :------------------------: |
|  `mergeMap`  |   高并发   |  不保证  |  不取消  | 并行处理，如并发 HTTP 请求 |
| `concatMap`  |    串行    |   保证   |  不取消  | 排队处理，如保持顺序的任务 |
| `switchMap`  |     1      |  不保证  | 取消旧的 |     自动完成、搜索建议     |
| `exhaustMap` |     1      |  不保证  | 忽略新的 | 防止重复提交、忽略重复点击 |
| `poolingMap` | 自定义限制 |    有    | 先进先出 |      固定并发限制场景      |



