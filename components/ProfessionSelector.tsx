import { useTheme } from "@/components/ThemeProvider";
import { Briefcase, ChevronDown, Search, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { professions, searchProfessions } from "../app/data/professions";
import { useProfessionStore } from "../app/store/useProfessionStore";
import type { IProfession } from "../app/types/profession";

const ProfessionSelector = () => {
  const { selectedProfession, setSelectedProfession } = useProfessionStore();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredProfessions, setFilteredProfessions] = useState(professions);

  useEffect(() => {
    const results = searchProfessions(searchText);
    setFilteredProfessions(results);
  }, [searchText]);

  const handleSelectProfession = (profession: IProfession) => {
    setSelectedProfession(profession);
    setModalVisible(false);
    setSearchText("");
  };

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      marginBottom: 16,
    },
    selector: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    selectorContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    selectedInfo: {
      marginLeft: 12,
      flex: 1,
    },
    selectedName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    selectedCount: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 2,
    },
    placeholder: {
      fontSize: 16,
      color: colors.muted,
      marginLeft: 12,
      flex: 1,
    },
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "80%",
      paddingBottom: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.border,
      margin: 16,
      paddingHorizontal: 12,
      borderRadius: 10,
      height: 48,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: colors.text,
      height: "100%",
    },
    count: {
      fontSize: 14,
      color: colors.muted,
      marginHorizontal: 16,
      marginBottom: 8,
    },
    list: {
      paddingHorizontal: 16,
    },
    item: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedItem: {
      backgroundColor: colors.primary + "10", // 10% opacity
      borderColor: colors.primary,
    },
    itemContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    itemText: {
      marginLeft: 12,
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 4,
    },
    itemDetails: {
      fontSize: 14,
      color: colors.muted,
    },
    checkmark: {
      position: "absolute",
      right: 16,
      top: 16,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    checkmarkText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "bold",
    },
    empty: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.muted,
    },
  });

  const renderProfessionItem = ({ item }: { item: IProfession }) => (
    <TouchableOpacity
      style={[
        styles.item,
        selectedProfession?.id === item.id && styles.selectedItem,
      ]}
      onPress={() => handleSelectProfession(item)}
    >
      <View style={styles.itemContent}>
        <Briefcase size={20} color={colors.primary} />
        <View style={styles.itemText}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>{item.questionCount} вопросов</Text>
        </View>
      </View>
      {selectedProfession?.id === item.id && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          {selectedProfession ? (
            <>
              <Briefcase size={20} color={colors.primary} />
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedName}>
                  {selectedProfession.name}
                </Text>
                <Text style={styles.selectedCount}>
                  {selectedProfession.questionCount} вопросов
                </Text>
              </View>
            </>
          ) : (
            <>
              <Briefcase size={20} color={colors.muted} />
              <Text style={styles.placeholder}>Выберите профессию</Text>
            </>
          )}
        </View>
        <ChevronDown size={20} color={colors.muted} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Выберите профессию</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBox}>
              <Search size={20} color={colors.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Поиск..."
                placeholderTextColor={colors.muted}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
            </View>

            <Text style={styles.count}>
              {filteredProfessions.length} из {professions.length}
            </Text>

            <FlatList
              data={filteredProfessions}
              renderItem={renderProfessionItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Профессий не найдено</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfessionSelector;
