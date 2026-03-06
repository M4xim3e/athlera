// Détecter le retour depuis Stripe Checkout
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('era_plus') === 'success') {
    window.history.replaceState({}, '', '/')
    // Le webhook Stripe va activer l'abonnement
    // On attend 2s puis on rafraîchit
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }
}
