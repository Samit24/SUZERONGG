import { lazy, Suspense } from "react";
import "./App.css";
import MainContainer from "./components/MainContainer";

const ThreatGlobe = lazy(() => import("./components/ThreatGlobe"));

const App = () => {
  return (
    <main className="main-body">
      <MainContainer>
        <Suspense>
          <ThreatGlobe />
        </Suspense>
      </MainContainer>
    </main>
  );
};

export default App;
