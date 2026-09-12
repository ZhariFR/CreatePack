import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Toujours visible dans la console pour le débogage, même en prod.
    console.error("Erreur non gérée dans le générateur de pack :", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="crash-screen">
          <h1>Oups, un problème est survenu</h1>
          <p>
            Le générateur a rencontré une erreur inattendue. Essaie de recharger la page — si le
            problème persiste, c'est probablement lié à une donnée de catégorie mal formée
            (lance <code>npm run validate</code> pour vérifier).
          </p>
          <button onClick={() => window.location.reload()}>Recharger la page</button>
        </div>
      );
    }

    return this.props.children;
  }
}
