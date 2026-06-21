# Guide d'Intégration Paiement - AFRO SOUND Premium

## 🎯 Options de Paiement Recommandées

### 1. Stripe (Recommandé pour Web + Mobile)
**Avantages** :
- ✅ Solutions mobile et web unifiées
- ✅ API puissante
- ✅ Tarification transparente
- ✅ Excellent support
- ✅ Paiements récurrents simples

**Coût** : 1.4% + 0.30€ par transaction

### 2. RevenueCat (Recommandé pour React Native)
**Avantages** :
- ✅ Abstraction App Store/Google Play
- ✅ Gestion abonnement facile
- ✅ Analytics intégré
- ✅ SDK React Native natif
- ✅ Trials et promotions

**Coût** : 1-15% du revenu (basé sur volume)

### 3. In-App Purchases (Apple/Google Native)
**Avantages** :
- ✅ Obligatoire pour App Store/Play Store
- ✅ Aucune commission externe
- ✅ Contrôle total

**Inconvénients** :
- ❌ 30% commission Apple/Google
- ❌ Setup complexe
- ❌ Deux SDK différents

---

## 🚀 Implémentation Option 1 : Stripe

### Installation

```bash
npm install @react-native-stripe-sdk/stripe-react-native
npm install react-native-stripe-sdk
```

### Configuration Stripe

```javascript
// src/config/stripe.js
import {initStripe} from '@react-native-stripe-sdk/stripe-react-native';

export const initializeStripe = async () => {
  await initStripe({
    publishableKey: process.env.REACT_APP_STRIPE_KEY,
    merchantIdentifier: 'com.afrosound.premium',
  });
};

export const STRIPE_PLANS = {
  monthly: 'price_1LK...', // À obtenir de Stripe
  yearly: 'price_2LK...',  // À obtenir de Stripe
  family: 'price_3LK...',  // À obtenir de Stripe
};
```

### Intégration dans Premium.js

```javascript
// src/screens/Premium.js
import {useStripe} from '@react-native-stripe-sdk/stripe-react-native';
import {STRIPE_PLANS} from '../config/stripe';

export default function Premium({navigation}) {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (plan) => {
    setIsProcessing(true);
    try {
      // 1. Créer une session de paiement (appel backend)
      const response = await fetch('YOUR_BACKEND/create-payment-intent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          planId: STRIPE_PLANS[plan],
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const {clientSecret, publishableKey} = await response.json();

      // 2. Initialiser le payment sheet
      const {error} = await initPaymentSheet({
        merchantDisplayName: 'AFRO SOUND',
        customerId: user.id,
        customerEphemeralKeySecret: publishableKey,
        paymentIntentClientSecret: clientSecret,
      });

      if (error) {
        Alert.alert('Erreur', error.message);
        return;
      }

      // 3. Présenter le payment sheet
      const {error: presentError} = await presentPaymentSheet();

      if (presentError) {
        Alert.alert('Erreur', presentError.message);
        return;
      }

      // 4. Succès !
      Alert.alert('Succès', 'Votre abonnement est actif!');
      navigation.goBack();

    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // ... reste du code
}
```

### Backend Stripe (Node.js/Express)

```javascript
// backend/routes/premium.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  try {
    const {planId, userId, userEmail} = req.body;

    // 1. Créer ou récupérer customer Stripe
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId = customers.data[0]?.id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {afroSoundUserId: userId},
      });
      customerId = customer.id;
    }

    // 2. Créer une subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{price: planId}],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const paymentIntent = subscription.latest_invoice.payment_intent;

    res.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
    });

  } catch (error) {
    res.status(400).json({error: error.message});
  }
});
```

---

## 🚀 Implémentation Option 2 : RevenueCat

### Installation

```bash
npm install react-native-purchases
cd ios && pod install && cd ..
```

### Configuration RevenueCat

```javascript
// src/config/revenuecat.js
import Purchases from 'react-native-purchases';

export const initializeRevenueCat = async (userId) => {
  await Purchases.setDebugLogsEnabled(true);
  
  await Purchases.configure({
    apiKey: process.env.REACT_APP_REVENUECAT_KEY,
    appUserID: userId,
  });

  // Écouter les changements de subscription
  Purchases.addCustomerInfoUpdateListener(
    async (customerInfo) => {
      // Vérifier le statut Premium
      const entitlements = customerInfo.entitlements.active;
      if (entitlements['premium']) {
        console.log('Utilisateur Premium actif');
      }
    }
  );
};

export const getAvailablePackages = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages || [];
};

export const purchasePackage = async (package) => {
  try {
    const {customerInfo} = await Purchases.purchasePackage(package);
    return customerInfo;
  } catch (error) {
    console.error('Erreur achat:', error);
    throw error;
  }
};

export const isPremium = async () => {
  const info = await Purchases.getCustomerInfo();
  return !!info.entitlements.active['premium'];
};
```

### Intégration dans Premium.js

```javascript
// Utilisation simplifiée avec RevenueCat
import {getAvailablePackages, purchasePackage} from '../config/revenuecat';

export default function Premium({navigation}) {
  const [packages, setPackages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const pkgs = await getAvailablePackages();
      setPackages(pkgs);
    } catch (error) {
      console.error('Erreur chargement packages:', error);
    }
  };

  const handleSubscribe = async (planIndex) => {
    setIsProcessing(true);
    try {
      const selectedPackage = packages[planIndex];
      const customerInfo = await purchasePackage(selectedPackage);
      
      if (customerInfo.entitlements.active['premium']) {
        Alert.alert('Succès', 'Bienvenue Premium!');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // ... reste du code
}
```

---

## 🚀 Implémentation Option 3 : In-App Purchases

### Installation

```bash
npm install react-native-iap
cd ios && pod install && cd ..
```

### Setup Initial

```javascript
// src/config/iap.js
import RNIap, {
  initConnection,
  getProducts,
  requestPurchase,
  flushFailedPurchasesCachedAsPendingAndroid,
  consumeAllItemsAndroid,
} from 'react-native-iap';

const productIds = [
  'afro_sound_monthly',   // iOS App Store
  'afro_sound_yearly',
  'afro_sound_family',
];

const skus = [
  'afro_sound_monthly_android', // Google Play
  'afro_sound_yearly_android',
  'afro_sound_family_android',
];

export const initializeIAP = async () => {
  try {
    await initConnection();
    if (Platform.OS === 'android') {
      await flushFailedPurchasesCachedAsPendingAndroid();
    }
  } catch (error) {
    console.error('Erreur IAP:', error);
  }
};

export const getProductsList = async () => {
  try {
    const products = await getProducts({
      skus: Platform.OS === 'ios' ? productIds : skus,
    });
    return products;
  } catch (error) {
    console.error('Erreur récupération produits:', error);
    return [];
  }
};

export const makePurchase = async (productId) => {
  try {
    await requestPurchase({
      skus: [productId],
    });
  } catch (error) {
    console.error('Erreur achat:', error);
    throw error;
  }
};
```

### Configuration App Store Connect

1. **Aller dans** : App Store Connect → Apps → [AFRO SOUND] → Subscriptions
2. **Créer les subscriptions** :
   - Monthly: $4.99/mois
   - Yearly: $39.99/an
   - Family: $14.99/mois (6 comptes)
3. **Récupérer les Product IDs**
4. **Ajouter à productIds dans config/iap.js**

### Configuration Google Play

1. **Aller dans** : Google Play Console → [AFRO SOUND] → Products → Subscriptions
2. **Créer les subscriptions** (même configuration)
3. **Récupérer les SKUs**
4. **Ajouter à skus dans config/iap.js**

---

## 🔐 Sécurité - Vérification Côté Serveur

### Structure Base de Données

```sql
-- PostgreSQL / Supabase
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id VARCHAR(50), -- 'monthly', 'yearly', 'family'
  status VARCHAR(50),   -- 'active', 'cancelled', 'expired'
  stripe_subscription_id VARCHAR(255),
  started_at TIMESTAMP,
  ends_at TIMESTAMP,
  payment_method VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Vérification Premium (API)

```javascript
// backend/middleware/checkPremium.js
export const checkPremium = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    const subscription = await db
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    req.user.isPremium = !!subscription;
    req.user.premiumPlan = subscription?.plan_id;
    
    next();
  } catch (error) {
    req.user.isPremium = false;
    next();
  }
};

// Usage dans routes
app.get('/download/:trackId', checkPremium, downloadTrack);
```

---

## ✅ Checklist Intégration Paiement

### Phase 1 : Préparation
- [ ] Choisir un provider paiement
- [ ] Créer compte marchand
- [ ] Obtenir les clés API
- [ ] Configurer les plans tarifaires
- [ ] Tester en mode sandbox

### Phase 2 : Intégration Frontend
- [ ] Installer SDK
- [ ] Configurer les produits
- [ ] Implémenter le flow d'achat
- [ ] Gérer les erreurs
- [ ] Tester sur device réel

### Phase 3 : Backend
- [ ] Créer les endpoints
- [ ] Implémenter la vérification
- [ ] Ajouter la base de données
- [ ] Gérer les webhooks
- [ ] Tester les transactions

### Phase 4 : Gestion des Cas
- [ ] Annulation d'abonnement
- [ ] Renouvellement automatique
- [ ] Restauration des achats
- [ ] Gestion des erreurs
- [ ] Logs et monitoring

### Phase 5 : Tests
- [ ] Test sandbox complet
- [ ] Test production
- [ ] Multi-device testing
- [ ] Cas d'erreur
- [ ] Performance

---

## 🐛 Dépannage Courant

### Erreur : "Invalid API Key"
```
❌ Les clés API sont incorrectes
✅ Vérifier dans les variables d'environnement
✅ Recharger l'app après modification
```

### Erreur : "Product not found"
```
❌ Les Product IDs ne correspondent pas
✅ Vérifier dans App Store Connect / Play Console
✅ Vérifier la casse exacte
```

### Erreur : "Payment failed"
```
❌ Problème de paiement utilisateur
✅ Vérifier la connexion Internet
✅ Tester avec une autre carte
✅ Vérifier les logs serveur
```

---

## 📚 Ressources

### Documentation Officielles
- [Stripe Mobile Payments](https://stripe.com/docs/stripe-mobile)
- [RevenueCat Docs](https://docs.revenuecat.com)
- [React Native IAP](https://github.com/react-native-iap/react-native-iap)

### Articles Útiles
- [Best Practices In-App Purchases](https://developer.apple.com/documentation/appstoreservernotifications)
- [Android Billing Best Practices](https://developer.android.com/google-play/billing/integrate)

### Outils
- [Stripe Testing Card Numbers](https://stripe.com/docs/testing)
- [RevenueCat Dashboard](https://dashboard.revenuecat.com)

---

## 💡 Recommandations Finales

### Pour MVP Rapide
- 🎯 Utiliser **RevenueCat**
- ⏱️ Temps setup : 1-2 jours
- 💰 Frais : 1-15% du revenu
- ✨ Avantage : Simple, efficace

### Pour Plus de Contrôle
- 🎯 Utiliser **Stripe**
- ⏱️ Temps setup : 3-5 jours
- 💰 Frais : 1.4% + €0.30/transaction
- ✨ Avantage : Flexible, puissant

### Pour Commissions Minimales
- 🎯 Utiliser **In-App Purchases**
- ⏱️ Temps setup : 5-7 jours
- 💰 Frais : 30% Apple/Google
- ✨ Avantage : Requis pour App Store

**Recommandation pour AFRO SOUND** : Combiner RevenueCat (mobile) + Stripe (web/admin)

---

**Version** : 1.0  
**Last Updated** : 2026  
**Status** : Guide complet
