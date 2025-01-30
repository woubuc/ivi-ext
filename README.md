# ivi extensions
Some of my utilities and helpers for use
with [ivi](https://github.com/localvoid/ivi).

## State
Wraps [`useState`](https://github.com/localvoid/ivi?tab=readme-ov-file#usestate)
in an Angular signals-inspired syntax, adding an in-place update function.

```ts
import { state } from 'ivi-ext/state';

component(c => {
  // ivi-ext
  let count = state(c, 0);

  // get the value
  count();

  // modify the value
  count.set(1);
  count.update(i => i + 1);
})
```

## Router
A simple router for ivi, somewhat inspired by the Angular router API.

```ts
import { component, html, update } from 'ivi';
import { createRouter, routerLink, RouterOutlet } from 'ivi-ext/router';

// A little dataset.
type Book = { id: number, title: string, author: string };
const books: Book[] = [
  { id: 1, title: 'Pride and Prejudice', author: 'Jane Austen' },
  { id: 2, title: '1984', autor: 'George Orwell' },
  { id: 3, title: 'Crime and Punishment', autor: 'Fyodor Dostoevsky' },
];

const BooksPage = component(c => {
  return () => books.map(book =>
    // Use routerLink([path]) instead of href to navigate using the router.
    html`<a ${ routerLink(`/books/${ book.id }`) }>${ book.title }</a>`,
  );
});

const BookDetailsPage = component<Book>(c => {
  return (book) => html`
    <h2>${ book.title }</h2>
    <p>Written by ${ book.author }</p>
  `;
});

const router = createRouter([
  {
    path: '/books',
    component: BooksPage,
  },
  {
    path: '/books/:bookId',
    component: BookDetailsPage,
    // Use the load function to provide props for your route component.
    load: ({ bookId }) => books.find(bookId),
  },
]);

const Root = component(c => {
  // Use RouterOutlet to show your active route component.
  return () => html`
    <h1>My books</h1>
    ${ RouterOutlet() }
  `;
});

update(
  createRoot(document.body),
  // Don't forget to provide the router context to your app.
  router.provide(Root()),
);
```

#### Navigation
The router doesn't touch any regular `<a href="[url]">` links on your page.
Instead, you can use the `routerLink([path])` directive to navigate using the
router.

The `routerLink` directive uses a `click` event and thus can be used on any
element. If you use it on an `<a>` tag, it will set the `href` attribute to
match the router path.

```ts
const Menu = () => html`
  <a ${ routerLink('/') }>Home</a>
  <button ${ routerLink('/login') }>Log in</button>
  <div ${ routerLink('/click') }>Don't do this, use interactive elements like a or div.</div>
`;
```

#### Path matching
Each route is identified by a path. The first route whose path matches the
current URL's path, will be activated.

Supported path syntax:

- Literal paths are the default. `'/foo'` matches the URL `/foo`.
- A `'*'` wildcard will match any value except `/`.
- A URL segment starting with `:` is extracted as a route parameter. So
  `'/:foo'` will match the URL `/foo` but also `/bar` (and any other value).
  It will match up until the next `/`.

#### Route params & data loading
Using route parameters will only get you so far. Usually, what you'll want to do
is use the value from your route parameter (e.g. an ID) to load additional data.
That's what the `load` function in your route config is for.

A route load function receives the extracted route parameters. The return value
is passed to the props of the route component. If the load function returns
a promise, it will be awaited before rendering the route component.

If no load function is given, the component receives the route parameter object.

```ts
const router = createRouter([
  // This route has no load function. SayHello receives an object containing
  // the route parameters, which for this route looks like { name: string }.
  { path: '/hello/:name', component: SayHello },

  // Instead of going directly to the component, the extracted route
  // parameters are passed to the provided load function. The returned value
  // is then passed to the component props.
  { path: '/hello/:id', component: SayHello, load: ({ id }) => names.get(id) },
]);

const SayHello = (props) => html`<p>Hello, <em>${ props.name }</em></p>`;
```

#### RegExp
The router uses regular expressions internally to match routes. You can also
choose to pass your own regex to the `path` property of a route. In this case,
the regex is used as-is to match the current URL's pathname.

Named capture groups will be extracted as route parameters.

```ts
createRouter([
  { path: /(?<rank>\d*)-(?<name>.*)/, component: ShowRank },
]);

const ShowRank = (props) => html`<p>#${ props.rank }: ${ props.name }</p>`;
```
