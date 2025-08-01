import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'default-change-detection-indirect',
    loadComponent: () =>
      import(
        './00-change-detection/default-change-detection/default-change-detection-parent.component'
      ).then((m) => m.ParentComponent),
    pathMatch: 'full',
  },
  {
    path: 'default-change-detection-direct',
    loadComponent: () =>
      import(
        './00-change-detection/default-change-detection/default-change-detectoin-parent-direct.component'
      ).then((m) => m.ParentComponent),
    pathMatch: 'full',
  },
  {
    path: 'onpush-change-detection',
    loadComponent: () =>
      import(
        './00-change-detection/onpush-change-detection/onpush-change-detection-parent.component'
      ).then((m) => m.ParentComponent),
    pathMatch: 'full',
  },
  {
    path: 'signal-change-detection',
    loadComponent: () =>
      import(
        './00-change-detection/signal-change-detection/signal-change-detection-parent.component'
      ).then((m) => m.ParentComponent),
    pathMatch: 'full',
  },
  {
    path: 'counter-signal',
    loadComponent: () =>
      import('./01-counter-signal/01-counter-signal.component').then(
        (m) => m.SignalsComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'counter-computed',
    loadComponent: () =>
      import('./02-counter-computed/02-counter-computed.component').then(
        (m) => m.CounterComputedComponent
      ),
    pathMatch: 'full',
  },
  /*
  {
    path: 'counter-effect',
    loadComponent: () => import('./03-counter-effect/03-counter-effect.component').then(m => m.CounterEffectComponent),
    pathMatch: 'full'
  },
  {
    path: 'linked-signal-race-condition',
    loadComponent: () => import('./04-linked-signal/04-linked-signal-race-condition.component').then(m => m.LinkedSignalRaceComponent),
    pathMatch: 'full'
  },
  {
    path: 'linked-signal',
    loadComponent: () => import('./04-linked-signal/04-linked-signal.component').then(m => m.LinkedSignalComponent),
    pathMatch: 'full'
  },
  {
    path: 'io-decorator',
    loadComponent: () => import('./05-input-output-signal/05-io-decorator.component').then(m => m.ParentDecoratorComponent),
    pathMatch: 'full'
  },
  {
    path: 'io-signal',
    loadComponent: () => import('./05-input-output-signal/05-io-signal.component').then(m => m.ParentSignalsComponent),
    pathMatch: 'full'
  },
  {
    path: 'queries-decorator',
    loadComponent: () => import('./07-queries-signal/07-queries-decorator.component').then(m => m.QueriesDecoratorComponent),
    pathMatch: 'full'
  },
  {
    path: 'queries-signal',
    loadComponent: () => import('./07-queries-signal/07-queries-signal.component').then(m => m.QueriesSignalsComponent),
    pathMatch: 'full'
  },
  {
    path: 'ng-model',
    loadComponent: () => import('./06-double-data-binding/06-ng-model.component').then(m => m.ClassicTwoWayComponent),
  },
  {
    path: 'model-signal',
    loadComponent: () => import('./06-double-data-binding/06-model-signal.component').then(m => m.SignalsTwoWayComponent),
  },
  {
    path: 'model-io-signal',
    loadComponent: () => import('./06-double-data-binding/06-model-io-signal.component').then(m => m.ModelIOSignalComponent),
  },
  {
    path: 'router-without-signal/user/:id',
    loadComponent: () => import('./08-router/08-router-without-signal.component').then(m => m.UserClassicComponent),
  },
  {
    path: 'router-signal/user/:id',
    loadComponent: () => import('./08-router/08-router-signal.component').then(m => m.UserSignalsComponent),
  },
  {
    path: 'async-http-client',
    loadComponent: () => import('./09-async/09-async-http-client.component').then(m => m.ClassicTodosComponent),
  },
  {
    path: 'async-http-resource',
    loadComponent: () => import('./09-async/09-async-http-resource.component').then(m => m.HttpResourceTodosComponent),
  },
  {
    path: 'async-resource',
    loadComponent: () => import('./09-async/09-async-resource.component').then(m => m.ResourceTodosComponent),
  },
  {
    path: 'rxjs-interop-to-signal',
    loadComponent: () => import('./10-rxjs-interop/10-rxjs-interop-to-signal.component').then(m => m.TickerSignalsComponent),
  },
  {
    path: 'rxjs-interop-to-observable',
    loadComponent: () => import('./10-rxjs-interop/10-rxjs-interop-to-observable.component').then(m => m.SignalToRxJSComponent),
  },
  {
    path: 'rxjs-interop-rx-resource',
    loadComponent: () => import('./10-rxjs-interop/10-rxjs-interop-rx-resource-component').then(m => m.RxResourceTodosComponent),
  },
  {
    path: 'rxjs-interop-take-until-destroyed',
    loadComponent: () => import('./10-rxjs-interop/10-rxjs-interop-rx-take-until-destroyed.component').then(m => m.TakeUntilDestroyedComponent),
  },
  {
    path: 'rxjs-interop-output',
    loadComponent: () => import('./10-rxjs-interop/10-rxjs-interop-output.component').then(m => m.TickDemoComponent),
  }
 */
];
