// components/ProfessionSelector.tsx
import { useTheme } from "@/components/ThemeProvider";
import { getQuestionCountForProfession, professionsList } from "@/constants/professionsList";
import { Briefcase, ChevronDown, Search, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfessionStore } from "./store/useProfessionStore";

export default function ProfessionSelector() {
  const { selectedProfession, setSelectedProfession } = useProfessionStore();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Фильтрация списка профессий по поисковому запросу
  const filteredProfessions = useMemo(() => {
    if (!searchText.trim()) return professionsList;
    const lowerQuery = searchText.toLowerCase();
    return professionsList.filter(prof =>
      prof.name.toLowerCase().includes(lowerQuery)
    );
  }, [searchText]);

  const handleSelect = (profession: { id: number; name: string }) => {
    // Сохраняем в стор объект с полями id и name (и, возможно, questionCount динамически)
    setSelectedProfession({ id: profession.id, name: profession.name });
    setModalVisible(false);
    setSearchText("");
  };

  const selectedQuestionCount = selectedProfession
    ? getQuestionCountForProfession(selectedProfession.id)
    : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          <Briefcase size={20} color={colors.primary} />
          {selectedProfession ? (
            <View style={styles.selectedInfo}>
              <Text style={[styles.selectedName, { color: colors.text }]}>
                {selectedProfession.name}
              </Text>
              <Text style={[styles.selectedCount, { color: colors.muted }]}>
                {selectedQuestionCount} вопросов
              </Text>
            </View>
          ) : (
            <Text style={[styles.placeholder, { color: colors.muted }]}>
              Выберите профессию
            </Text>
          )}
        </View>
        <ChevronDown size={20} color={colors.muted} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.text }]}>Выберите профессию</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <X size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchBox, { backgroundColor: colors.border }]}>
              <Search size={20} color={colors.muted} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Поиск..."
                placeholderTextColor={colors.muted}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
            </View>

            <Text style={[styles.count, { color: colors.muted }]}>
              {filteredProfessions.length} из {professionsList.length}
            </Text>

            <FlatList
              data={filteredProfessions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const questionCount = getQuestionCountForProfession(item.id);
                const isSelected = selectedProfession?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      isSelected && { backgroundColor: colors.primary + "20", borderColor: colors.primary },
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.itemContent}>
                      <Briefcase size={20} color={colors.primary} />
                      <View style={styles.itemText}>
                        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                        <Text style={[styles.itemDetails, { color: colors.muted }]}>
                          {questionCount} вопросов
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={[styles.emptyText, { color: colors.muted }]}>Профессий не найдено</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 16 },
  selector: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  selectedInfo: { marginLeft: 12, flex: 1 },
  selectedName: { fontSize: 16, fontWeight: "600" },
  selectedCount: { fontSize: 14, marginTop: 2 },
  placeholder: { fontSize: 16, marginLeft: 12, flex: 1 },
  modal: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, height: "80%", paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: "700" },
  closeButton: { padding: 4 },
  searchBox: { flexDirection: "row", alignItems: "center", margin: 16, paddingHorizontal: 12, borderRadius: 10, height: 48 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, height: "100%" },
  count: { fontSize: 14, marginHorizontal: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16 },
  item: { padding: 16, borderRadius: 10, marginBottom: 8, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  itemText: { marginLeft: 12, flex: 1 },
  itemName: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  itemDetails: { fontSize: 14 },
  checkmark: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  checkmarkText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 16 },
});