# babel-plugin-react-component-trace-data-attr
Adds `data-component-trace` attribute to html elements showing the trace of React components names that led to this element creation.

> Note: it will only work with JSX elements, not with `React.createElement`. If you're using TypeScript and transpile it separately, use `"jsx": "preserve"` in your `tsconfig.json` and add `preset-react` to your babel presets.

## Example
Considering components structure:
```jsx
const HeaderOfComponent = () => <h1 />;
const ContentOfComponent = () => <div />;
const SecondComponent = () => <><HeaderOfComponent /><ContentOfComponent /></>;
const Component = () => <SecondComponent />;

render(<Component />);
```

Resulting HTML markup will look like this:
```html
<h1 data-component-trace="/component/second-component/header-of-component"></h1>
<div data-component-trace="/component/second-component/content-of-component"></div>
```
where components names are separated by `/`

## Options:
- **`attribute`** - any attribute name you want, should begin from `data-`. Default: `data-component-trace`.
- **`format`** - can be "camel" (camelCase), "snake" (snake_case) or "kebab" (kebab-case). Default: `kebab`.

Example:
```json
  ["react-component-trace-data-attr", {
    "attribute": "data-component-trace",
    "format": "kebab"
  }]
```
