import checkValidOptions from './options'

const findOrAddDataProperty = (t, properties, identifier, attribute) => {
  for (const prop of properties) {
    if (prop.key.type === 'StringLiteral' && prop.key.value === attribute) {
      return prop.value;
    }
  }
  properties.push(t.objectProperty(
    t.stringLiteral(attribute),
    identifier,
    true,
    false,
  ));
  return identifier;
}

const handleOpeningElement = (t, path, options) => {
  const functionParent = path.getFunctionParent();

  let componentName;
  let parentDataAttrExpression;

  if (functionParent.type == "ClassMethod" || functionParent.parent.type == "ClassProperty") {
    componentName = functionParent.findParent((path) => path.isClassExpression() || path.isClassDeclaration()).node.id.name;
    parentDataAttrExpression = t.memberExpression(
      t.memberExpression(t.thisExpression(), t.identifier('props')),
      t.stringLiteral(options.attribute),
      true,
    );
  } else if (functionParent.parent.type === "VariableDeclarator") {
    componentName = functionParent.parent.id.name;
    if (functionParent.node.params.length === 1) {
      if (functionParent.node.params[0].type === 'ObjectPattern') {
        parentDataAttrExpression = findOrAddDataProperty(
          t,
          functionParent.node.params[0].properties,
          path.scope.generateUidIdentifier(),
          options.attribute
        );
      } else {
        parentDataAttrExpression = t.memberExpression(
          functionParent.node.params[0],
          t.stringLiteral(options.attribute),
          true,
        );
      }
    }
  } else {
    return;
  }

  path.node.attributes.push(t.jSXAttribute(
    t.jSXIdentifier(options.attribute),
    t.jSXExpressionContainer(
      t.binaryExpression(
        "+",
        parentDataAttrExpression
          ? t.logicalExpression("||", parentDataAttrExpression, t.stringLiteral(""))
          : t.stringLiteral(""),
        t.stringLiteral(options.separator + options.format(componentName))
      )
    )
  ));
};

export default function (babel) {
  const { types: t } = babel;

  return {
    visitor: {
      JSXOpeningElement(path, state) {
        const options = checkValidOptions(state);
        handleOpeningElement(t, path, options);
      }
    }
  };
}
