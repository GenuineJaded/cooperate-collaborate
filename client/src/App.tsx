import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Forum from "./pages/Forum";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/field" component={Forum} />
      <Route path="/field/:door" component={Forum} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <Toaster />
        <Router />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
