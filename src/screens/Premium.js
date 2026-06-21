import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme, {Colors, Radius, Shadows, Spacing, Typography} from '../theme';

const PremiumBenefit = ({icon, title, description}) => (
  <View style={styles.benefitCard}>
    <View style={styles.benefitIcon}>
      <Ionicons name={icon} size={28} color={Colors.primary} />
    </View>
    <View style={styles.benefitContent}>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDescription}>{description}</Text>
    </View>
  </View>
);

export default function Premium({navigation}) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async plan => {
    setIsProcessing(true);
    try {
      // Simulating payment processing
      // In production, integrate with Stripe or similar payment provider
      setTimeout(() => {
        Alert.alert(
          'Succès',
          `Vous avez souscrit au plan ${plan} avec succès!`,
          [
            {
              text: 'OK',
              onPress: () => {
                setIsProcessing(false);
                navigation.goBack();
              },
            },
          ],
        );
      }, 2000);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du paiement.');
      setIsProcessing(false);
    }
  };

  return (
    <View style={[theme.container, styles.mainContainer]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Premium</Text>
          <View style={{width: 24}} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Ionicons name="star" size={16} color={Colors.primary} />
            <Text style={styles.heroBadgeText}>Accès illimité</Text>
          </View>
          <Text style={styles.heroTitle}>Débloquez toute la musique</Text>
          <Text style={styles.heroSubtitle}>
            Écoutez sans limites, téléchargez hors ligne et profitez d&apos;une
            expérience sans publicité.
          </Text>
        </View>

        {/* Showcase Image */}
        <View style={styles.showcaseContainer}>
          <View style={styles.showcase}>
            <Ionicons name="musical-notes" size={80} color={Colors.primary} />
          </View>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Avantages Premium</Text>
          <PremiumBenefit
            icon="cloud-download"
            title="Téléchargements illimités"
            description="Téléchargez vos morceaux préférés pour les écouter hors ligne"
          />
          <PremiumBenefit
            icon="volume-mute"
            title="Pas de publicités"
            description="Écoutez votre musique sans interruptions publicitaires"
          />
          <PremiumBenefit
            icon="infinite"
            title="Écoutes illimitées"
            description="Aucune limite d&apos;écoute ni de sauts"
          />
          <PremiumBenefit
            icon="shuffle"
            title="Qualité audio supérieure"
            description="Écoutez en qualité haute fidélité et sans compression"
          />
          <PremiumBenefit
            icon="share-social"
            title="Partages prioritaires"
            description="Partagez vos playlists avec priorité et sans limite"
          />
          <PremiumBenefit
            icon="analytics"
            title="Statistiques avancées"
            description="Consultez vos statistiques d&apos;écoute détaillées"
          />
        </View>

        {/* Pricing Plans */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Choisissez votre plan</Text>

          {/* Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Mensuel</Text>
              {selectedPlan === 'monthly' && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>
              €4.99<Text style={styles.planPeriod}>/mois</Text>
            </Text>
            <Text style={styles.planDescription}>Facturé mensuellement</Text>
          </TouchableOpacity>

          {/* Yearly Plan (Best Value) */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.planCardSelected,
              styles.planCardBestValue,
            ]}
            onPress={() => setSelectedPlan('yearly')}>
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>Meilleure valeur</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Annuel</Text>
              {selectedPlan === 'yearly' && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>
              €39.99<Text style={styles.planPeriod}>/an</Text>
            </Text>
            <Text style={styles.planDescription}>Économisez €19.89</Text>
          </TouchableOpacity>

          {/* Family Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'family' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('family')}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Famille (6 comptes)</Text>
              {selectedPlan === 'family' && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>
              €14.99<Text style={styles.planPeriod}>/mois</Text>
            </Text>
            <Text style={styles.planDescription}>Partagé entre 6 personnes</Text>
          </TouchableOpacity>
        </View>

        {/* Call to Action */}
        <TouchableOpacity
          style={[
            styles.subscribButton,
            isProcessing && styles.subscribButtonDisabled,
          ]}
          onPress={() => handleSubscribe(selectedPlan)}
          disabled={isProcessing}>
          {isProcessing ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <>
              <Ionicons
                name="star"
                size={20}
                color={Colors.background}
                style={styles.buttonIcon}
              />
              <Text style={styles.subscribButtonText}>
                S&apos;abonner maintenant
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Trial Info */}
        <View style={styles.trialInfo}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.textSoft} />
          <Text style={styles.trialText}>
            Essai gratuit de 7 jours. Annulez à tout moment.
          </Text>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <TouchableOpacity>
            <Text style={styles.termsLink}>Conditions d&apos;utilisation</Text>
          </TouchableOpacity>
          <Text style={styles.termsSeparator}>•</Text>
          <TouchableOpacity>
            <Text style={styles.termsLink}>Politique de confidentialité</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: Colors.background},
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  heroSection: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 165, 59, 0.1)',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(231, 165, 59, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: Colors.textSoft,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: '90%',
  },
  showcaseContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  showcase: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.surfaceAccent,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.soft,
  },
  featuresSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: 30,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surfaceAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  benefitDescription: {
    color: Colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  pricingSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 12,
  },
  planCardSelected: {
    backgroundColor: Colors.surfaceAccent,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  planCardBestValue: {
    marginBottom: 12,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  bestValueText: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(231, 165, 59, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planPrice: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSoft,
  },
  planDescription: {
    color: Colors.textSoft,
    fontSize: 12,
  },
  subscribButton: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 56,
    ...Shadows.soft,
    marginBottom: 16,
  },
  subscribButtonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  subscribButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  trialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    marginHorizontal: Spacing.md,
    marginBottom: 16,
  },
  trialText: {
    color: Colors.textSoft,
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  termsLink: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  termsSeparator: {
    color: Colors.border,
    marginHorizontal: 8,
  },
});
