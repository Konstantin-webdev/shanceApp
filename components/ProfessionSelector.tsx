import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import { useProfessionStore } from "../app/store/useProfessionStore";
import {
  IProfession,
  professions,
  searchProfessions,
} from "../app/data/professions";

// Импортируем иконки из Lucide
import {
  ChevronDown,
  X,
  Search,
  User,
  Briefcase,
  Car,
  Wrench,
  Zap,
  HardHat,
  Shield,
  Cog,
  Truck,
  Hammer,
  Factory,
  ClipboardCheck,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// Функция для получения иконки по профессии
const getProfessionIcon = (professionName: string) => {
  const name = professionName.toLowerCase();

  if (name.includes("электромонтер") || name.includes("электрик")) {
    return <Zap size={20} color="#007AFF" />;
  }
  if (name.includes("водитель") || name.includes("шофер")) {
    return <Car size={20} color="#007AFF" />;
  }
  if (name.includes("слесарь") || name.includes("ремонтник")) {
    return <Wrench size={20} color="#007AFF" />;
  }
  if (name.includes("сварщик")) {
    return <HardHat size={20} color="#007AFF" />;
  }
  if (
    name.includes("крановщик") ||
    name.includes("экскаватор") ||
    name.includes("бульдозер")
  ) {
    return <Truck size={20} color="#007AFF" />;
  }
  if (name.includes("бухгалтер") || name.includes("экономист")) {
    return <Briefcase size={20} color="#007AFF" />;
  }
  if (name.includes("безопасность")) {
    return <Shield size={20} color="#007AFF" />;
  }
  if (name.includes("оператор") || name.includes("диспетчер")) {
    return <Cog size={20} color="#007AFF" />;
  }
  if (name.includes("инженер") || name.includes("специалист")) {
    return <User size={20} color="#007AFF" />;
  }
  if (
    name.includes("строитель") ||
    name.includes("каменщик") ||
    name.includes("маляр")
  ) {
    return <Hammer size={20} color="#007AFF" />;
  }
  if (
    name.includes("завод") ||
    name.includes("производство") ||
    name.includes("технологи")
  ) {
    return <Factory size={20} color="#007AFF" />;
  }

  return <Briefcase size={20} color="#007AFF" />; // Иконка по умолчанию
};

const ProfessionSelector = () => {
  // Используем Zustand store
  const { selectedProfession, setSelectedProfession } = useProfessionStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredProfessions, setFilteredProfessions] = useState(professions);

  // Фильтруем профессии при изменении поискового запроса
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredProfessions(professions);
    } else {
      const filtered = searchProfessions(searchText);
      setFilteredProfessions(filtered);
    }
  }, [searchText]);

  const handleSelectProfession = (profession: IProfession) => {
    setSelectedProfession(profession); // Сохраняем в Zustand
    setModalVisible(false);
    setSearchText("");
  };

  const renderProfessionItem = ({ item }: { item: IProfession }) => (
    <TouchableOpacity
      style={[
        styles.professionItem,
        selectedProfession?.id === item.id && styles.selectedItem,
      ]}
      onPress={() => handleSelectProfession(item)}
    >
      <View style={styles.professionIconContainer}>
        {getProfessionIcon(item.name)}
      </View>
      <View style={styles.professionInfo}>
        <Text style={styles.professionName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.professionDetails}>
          ID: {item.id} • {item.questionCount} вопросов
        </Text>
      </View>
      {selectedProfession?.id === item.id && (
        <ClipboardCheck size={20} color="#34C759" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Поле выбора профессии */}
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
          {selectedProfession ? (
            <>
              <View style={styles.selectedProfessionIcon}>
                {getProfessionIcon(selectedProfession.name)}
              </View>
              <View style={styles.selectedProfessionInfo}>
                <Text style={styles.selectorButtonText} numberOfLines={1}>
                  {selectedProfession.name}
                </Text>
                <Text style={styles.selectorSubText}>
                  {selectedProfession.questionCount} вопросов
                </Text>
              </View>
            </>
          ) : (
            <>
              <Briefcase
                size={20}
                color="#999"
                style={styles.placeholderIcon}
              />
              <Text style={styles.placeholderText}>
                Выберите профессию для начала
              </Text>
            </>
          )}
        </View>
        <ChevronDown size={20} color="#007AFF" />
      </TouchableOpacity>

      {/* Модальное окно */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSearchText("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Заголовок модального окна */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Briefcase size={24} color="#007AFF" />
                <Text style={styles.modalTitle}>Выберите профессию</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchText("");
                }}
                style={styles.closeButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Поле поиска */}
            <View style={styles.searchContainer}>
              <Search size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Поиск профессии..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
                autoFocus={true}
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchText("")}
                  style={styles.clearSearchButton}
                >
                  <X size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {/* Информация о количестве */}
            <View style={styles.countContainer}>
              <Text style={styles.countText}>
                Найдено: {filteredProfessions.length} из {professions.length}
              </Text>
            </View>

            {/* Список профессий */}
            <FlatList
              data={filteredProfessions}
              renderItem={renderProfessionItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Search size={48} color="#DDD" />
                  <Text style={styles.emptyText}>Профессий не найдено</Text>
                  <Text style={styles.emptyHint}>
                    Попробуйте изменить запрос
                  </Text>
                </View>
              }
            />

            {/* Кнопка отмены внизу */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setSearchText("");
              }}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  selectorButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedProfessionIcon: {
    marginRight: 12,
  },
  selectedProfessionInfo: {
    flex: 1,
  },
  selectorButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  selectorSubText: {
    fontSize: 13,
    color: "#8E8E93",
  },
  placeholderIcon: {
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: "#8E8E93",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1C1C1E",
  },
  clearSearchButton: {
    padding: 4,
  },
  countContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  countText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  professionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: "#F0F7FF",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  professionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  professionInfo: {
    flex: 1,
  },
  professionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    lineHeight: 22,
  },
  professionDetails: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 15,
    color: "#C7C7CC",
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#007AFF",
  },
});

export default ProfessionSelector;
