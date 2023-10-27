import { Lines } from "components/Lines/Lines";
import { Node, registerConnector } from "components/Node";
import { Scene } from "components/Scene";

const TestNode1 = () => {
  registerConnector({ type: 'in' });

  return (
    <>
      <h1>Hi asdasd asd asdadasdasd</h1>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd asdasd</h1>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd </h1>
    </>
  );
};

const TestNode2 = () => {
  registerConnector({ type: 'out', color: 'blue' });

  return (
    <>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd </h1>
    </>
  );
};

export const App = () => {
  return (
    <Scene>
      <Lines>
        <Node title="Какая-то нода 1" key="1">
          <TestNode1 />
        </Node>
        <Node title="Какая-то нода 2" key="2">
          <TestNode2 />
        </Node>
      </Lines>
    </Scene>
  );
};