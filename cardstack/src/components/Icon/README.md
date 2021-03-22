## Icon

Our icon component uses `Feather` icons by default with `react-native-vector-icons` but also has the ability to add custom icons.

## Adding a Custom Icon

Take the web version of the SVG and use [this converter](https://react-svgr.com/playground/?native=true&typescript=true) to transform this SVG into a component using `react-native-svg`. Add a new file for your component with the icon's name and paste in the transformed SVG. 

There's a couple steps you'll need to take to properly integrate the SVG icon file:

- Ignore the TS issue with the `xmlns` prop
- Remove the full spread of props and instead just pass the following
  ```
  width={props.width || 20}
  height={props.height || 20}
  ```
- If you want the color to be updated by a passed color prop, updated all stroke/fill props that are not "none" with the following
  ```
  fill={props.fill || '#00ebe5'}
  stroke={props.stroke || '#00ebe5'}
  ```

The last step is to add your file to the `custom-icons/index.ts` object. The key of the object is the icon name and the value is the require of your icon file. For example, if you are adding an icon named `foo`, you can add the custom icon as follows:

```
foo: require('./foo').default,
```