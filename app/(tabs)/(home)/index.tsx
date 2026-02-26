
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

// Predefined scenarios
const SCENARIOS = [
  { id: 'raise', label: 'Not asking for a raise', icon: 'trending-up' },
  { id: 'job', label: 'Staying in the same job', icon: 'work' },
  { id: 'freelance', label: 'Not raising freelance prices', icon: 'attach-money' },
  { id: 'price', label: 'Delaying a price increase', icon: 'arrow-upward' },
  { id: 'debt', label: 'Carrying credit card debt', icon: 'credit-card' },
  { id: 'subscriptions', label: 'Unused subscriptions', icon: 'cancel' },
  { id: 'cash', label: 'Cash sitting idle', icon: 'account-balance' },
  { id: 'clients', label: 'Waiting to switch clients', icon: 'swap-horiz' },
];

// DEFINITIVE CALCULATION MULTIPLIERS
// These convert any time unit to YEARLY loss
// Formula: yearlyLoss = amount × multiplier
const TIME_UNITS = [
  { 
    id: 'hour', 
    label: 'per hour', 
    multiplier: 8760 // 24 hours/day × 365 days/year = 8760 hours/year
  },
  { 
    id: 'day', 
    label: 'per day', 
    multiplier: 365 // 365 days per calendar year
  },
  { 
    id: 'month', 
    label: 'per month', 
    multiplier: 12 // 12 months per year
  },
  { 
    id: 'year', 
    label: 'per year', 
    multiplier: 1 // 1 year per year
  },
];

// Emotional comparisons based on 5-year loss amount
const getComparison = (fiveYearLoss: number) => {
  if (fiveYearLoss >= 500000) return "That's a luxury car over 5 years";
  if (fiveYearLoss >= 250000) return "That's a significant down payment on a house over 5 years";
  if (fiveYearLoss >= 100000) return "That's multiple years of rent over 5 years";
  if (fiveYearLoss >= 50000) return "That's a dream vacation every year for 5 years";
  if (fiveYearLoss >= 25000) return "That's a new car over 5 years";
  if (fiveYearLoss >= 10000) return "That's a weekend getaway every few months over 5 years";
  if (fiveYearLoss >= 5000) return "That's a new laptop every year over 5 years";
  return "That's money you'll never see again over 5 years";
};

export default function HomeScreen() {
  const [step, setStep] = useState<'scenario' | 'input' | 'results'>('scenario');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<string>('month');
  
  // CALCULATION LOGIC - DEFINITIVE VERSION
  // Step 1: Parse the input amount
  const numAmount = parseFloat(amount) || 0;
  
  // Step 2: Find the selected time unit and its multiplier
  const selectedTimeUnit = TIME_UNITS.find(t => t.id === timeUnit);
  const multiplier = selectedTimeUnit?.multiplier || 1;
  
  // Step 3: Calculate yearly loss (this is the foundation)
  const yearlyLoss = numAmount * multiplier;
  
  // Step 4: Derive monthly loss from yearly
  const monthlyLoss = yearlyLoss / 12;
  
  // Step 5: Calculate 5-year loss from yearly
  const fiveYearLoss = yearlyLoss * 5;
  
  // Step 6: Get emotional comparison
  const comparison = getComparison(fiveYearLoss);

  const handleScenarioSelect = (scenarioId: string) => {
    console.log('User selected scenario:', scenarioId);
    setSelectedScenario(scenarioId);
    setStep('input');
  };

  const handleCalculate = () => {
    console.log('=== CALCULATION DETAILS ===');
    console.log('Input Amount:', numAmount);
    console.log('Time Unit:', timeUnit);
    console.log('Multiplier:', multiplier);
    console.log('Yearly Loss:', yearlyLoss, '(', numAmount, '×', multiplier, ')');
    console.log('Monthly Loss:', monthlyLoss, '(', yearlyLoss, '÷ 12 )');
    console.log('5-Year Loss:', fiveYearLoss, '(', yearlyLoss, '× 5 )');
    console.log('===========================');
    
    Keyboard.dismiss();
    if (numAmount > 0) {
      setStep('results');
    }
  };

  const handleReset = () => {
    console.log('User reset calculation');
    setStep('scenario');
    setSelectedScenario('');
    setAmount('');
    setTimeUnit('month');
  };

  const scenarioLabel = SCENARIOS.find(s => s.id === selectedScenario)?.label || '';

  // SCENARIO SELECTION SCREEN
  if (step === 'scenario') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>What are you waiting for?</Text>
          <Text style={styles.headerSubtitle}>Select your situation</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {SCENARIOS.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              style={styles.scenarioCard}
              onPress={() => handleScenarioSelect(scenario.id)}
              activeOpacity={0.7}
            >
              <IconSymbol
                android_material_icon_name={scenario.icon as any}
                size={32}
                color={colors.primary}
              />
              <Text style={styles.scenarioLabel}>{scenario.label}</Text>
              <IconSymbol
                android_material_icon_name="arrow-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // INPUT SCREEN
  if (step === 'input') {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.inputScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>{scenarioLabel}</Text>
                <Text style={styles.inputSubtitle}>How much are you losing?</Text>

                <View style={styles.amountInputContainer}>
                  <Text style={styles.dollarSign}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </View>

                <View style={styles.timeUnitContainer}>
                  {TIME_UNITS.map((unit) => {
                    const isSelected = timeUnit === unit.id;
                    return (
                      <TouchableOpacity
                        key={unit.id}
                        style={[
                          styles.timeUnitButton,
                          isSelected && styles.timeUnitButtonSelected
                        ]}
                        onPress={() => {
                          setTimeUnit(unit.id);
                          Keyboard.dismiss();
                        }}
                      >
                        <Text style={[
                          styles.timeUnitText,
                          isSelected && styles.timeUnitTextSelected
                        ]}>
                          {unit.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={[styles.calculateButton, numAmount === 0 && styles.calculateButtonDisabled]}
                  onPress={handleCalculate}
                  disabled={numAmount === 0}
                >
                  <Text style={styles.calculateButtonText}>Calculate the cost</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  // RESULTS SCREEN
  // Format numbers for display (no decimals for cleaner look)
  const monthlyLossFormatted = monthlyLoss.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const yearlyLossFormatted = yearlyLoss.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const fiveYearLossFormatted = fiveYearLoss.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsScenario}>{scenarioLabel}</Text>
          <Text style={styles.resultsSubtitle}>Cost of waiting</Text>
        </View>

        <View style={styles.lossCard}>
          <Text style={styles.lossLabel}>Per month</Text>
          <View style={styles.lossAmountContainer}>
            <Text style={styles.lossDollar}>$</Text>
            <Text style={styles.lossAmount}>{monthlyLossFormatted}</Text>
          </View>
        </View>

        <View style={styles.lossCard}>
          <Text style={styles.lossLabel}>Per year</Text>
          <View style={styles.lossAmountContainer}>
            <Text style={styles.lossDollar}>$</Text>
            <Text style={styles.lossAmount}>{yearlyLossFormatted}</Text>
          </View>
        </View>

        <View style={[styles.lossCard, styles.lossCardHighlight]}>
          <Text style={styles.lossLabel}>Over 5 years</Text>
          <View style={styles.lossAmountContainer}>
            <Text style={styles.lossDollar}>$</Text>
            <Text style={styles.lossAmount}>{fiveYearLossFormatted}</Text>
          </View>
        </View>

        <View style={styles.comparisonContainer}>
          <IconSymbol
            android_material_icon_name="info"
            size={24}
            color={colors.accent}
          />
          <Text style={styles.comparisonText}>{comparison}</Text>
        </View>

        <View style={styles.urgencyContainer}>
          <Text style={styles.urgencyText}>Waiting is costing you more than acting.</Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Calculate another</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This is an illustration only. Not financial advice.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  scenarioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.backgroundAlt,
  },
  scenarioLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 16,
  },
  inputScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  inputSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dollarSign: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.text,
    minWidth: 200,
    textAlign: 'left',
  },
  timeUnitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 48,
  },
  timeUnitButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.backgroundAlt,
  },
  timeUnitButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeUnitText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  timeUnitTextSelected: {
    color: colors.text,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  calculateButtonDisabled: {
    opacity: 0.5,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  resultsContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 120,
  },
  resultsHeader: {
    marginBottom: 32,
  },
  resultsScenario: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  lossCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.backgroundAlt,
  },
  lossCardHighlight: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  lossLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  lossAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  lossDollar: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 4,
  },
  lossAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  comparisonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  urgencyContainer: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  urgencyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  resetButton: {
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
