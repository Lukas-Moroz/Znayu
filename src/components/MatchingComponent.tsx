import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface MatchingComponentProps {
  leftColumnItems: string[];
  rightColumnItems: string[];
  correctPairs: Record<string, string>;
  onComplete: (isCorrect: boolean) => void;
}

const MatchingComponent: React.FC<MatchingComponentProps> = ({
  leftColumnItems,
  rightColumnItems,
  correctPairs,
  onComplete,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches({});
    setSubmitted(false);
  }, [leftColumnItems.join(','), rightColumnItems.join(',')]);

  const handleLeftPress = (item: string) => {
    if (submitted) return;
    
    // If item is already selected, deselect it
    if (selectedLeft === item) {
      setSelectedLeft(null);
      return;
    }
    
    // If this item is already matched, don't allow selection
    if (matches[item]) {
      return;
    }
    
    setSelectedLeft(item);
    
    // If right item is already selected, create the match
    if (selectedRight) {
      createMatch(item, selectedRight);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const handleRightPress = (item: string) => {
    if (submitted) return;
    
    // If item is already selected, deselect it
    if (selectedRight === item) {
      setSelectedRight(null);
      return;
    }
    
    // If this item is already matched, don't allow selection
    if (Object.values(matches).includes(item)) {
      return;
    }
    
    setSelectedRight(item);
    
    // If left item is already selected, create the match
    if (selectedLeft) {
      createMatch(selectedLeft, item);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const createMatch = (left: string, right: string) => {
    setMatches(prev => ({
      ...prev,
      [left]: right
    }));
  };

  const handleCheck = () => {
    setSubmitted(true);
    
    let correctCount = 0;
    Object.keys(correctPairs).forEach(leftItem => {
      if (matches[leftItem] === correctPairs[leftItem]) {
        correctCount++;
      }
    });
    
    const isCorrect = correctCount === Object.keys(correctPairs).length;
    
    // Delay answer callback to allow visual feedback to show first
    setTimeout(() => {
      onComplete(isCorrect);
    }, 300);
  };

  const getLeftItemStyle = (item: string) => {
    const baseStyle: any[] = [styles.matchItem];
    
    if (selectedLeft === item) {
      baseStyle.push(styles.selectedItem);
    }
    
    if (matches[item]) {
      baseStyle.push(styles.matchedItem);
    }
    
    if (submitted) {
      if (matches[item] === correctPairs[item]) {
        baseStyle.push(styles.correctMatch);
      } else {
        baseStyle.push(styles.incorrectMatch);
      }
    }
    
    return baseStyle;
  };

  const getRightItemStyle = (item: string) => {
    const baseStyle: any[] = [styles.matchItem];
    
    if (selectedRight === item) {
      baseStyle.push(styles.selectedItem);
    }
    
    const isMatched = Object.values(matches).includes(item);
    if (isMatched) {
      baseStyle.push(styles.matchedItem);
    }
    
    if (submitted) {
      const leftKey = Object.keys(matches).find(key => matches[key] === item);
      if (leftKey && correctPairs[leftKey] === item) {
        baseStyle.push(styles.correctMatch);
      } else if (leftKey) {
        baseStyle.push(styles.incorrectMatch);
      }
    }
    
    return baseStyle;
  };

  const canSubmit = Object.keys(matches).length === leftColumnItems.length;

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Tap items to match them</Text>
      
      <View style={styles.columnsContainer}>
        <ScrollView style={[styles.column, { marginRight: 7.5 }]}>
          {leftColumnItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={getLeftItemStyle(item)}
              onPress={() => handleLeftPress(item)}
              disabled={submitted || !!matches[item]}
            >
              <Text style={styles.itemText}>{item}</Text>
              {matches[item] && (
                <Text style={styles.matchIndicator}>→</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <ScrollView style={[styles.column, { marginLeft: 7.5 }]}>
          {rightColumnItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={getRightItemStyle(item)}
              onPress={() => handleRightPress(item)}
              disabled={submitted || Object.values(matches).includes(item)}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <TouchableOpacity
        style={[
          styles.checkButton,
          !canSubmit && styles.checkButtonDisabled
        ]}
        onPress={handleCheck}
        disabled={!canSubmit || submitted}
      >
        <Text style={styles.checkButtonText}>
          {submitted ? 'Submitted' : 'Check Answers'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  columnsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  column: {
    flex: 1,
  },
  matchItem: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedItem: {
    backgroundColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  matchedItem: {
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD700',
  },
  correctMatch: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  incorrectMatch: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  matchIndicator: {
    position: 'absolute',
    right: 10,
    fontSize: 18,
    color: '#4A90E2',
  },
  checkButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  checkButtonDisabled: {
    backgroundColor: '#CCC',
  },
  checkButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MatchingComponent;

