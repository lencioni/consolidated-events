# consolidated-events

Manage multiple event handlers using few event listeners.

## Example

```js
import { addEventListener, removeEventListener } from 'consolidated-events';

const listenerId = addEventListener(
  window,
  'scroll',
  () => { console.log('scrolling') },
  { passive: true }
);

...

removeEventListener(window, 'scroll', listenerId, { passive: true });
```
