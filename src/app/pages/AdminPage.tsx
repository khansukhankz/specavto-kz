import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Save,
  Loader,
  ChevronDown,
  ChevronUp,
  LogOut,
  AlertTriangle,
  RotateCcw,
  Building2,
  Pickaxe,
  HardHat,
  Truck,
  Construction,
  Package,
  Plus,
  X,
  Trash2
} from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { useNavigate } from 'react-router';
import logoImage from 'figma:asset/96296ef438adf21c7e9a93c090c6d074154c807b.png';

interface Equipment {
  id: number | string;
  name: string;
  pricePerDay: number;
  icon: string;
  categoryId: string;
  brandId: string;
  photoUrls?: string[];
  specs: {
    power?: string;
    capacity: string;
    weight: string;
    brand?: string;
    model?: string;
    year?: string;
    enginePower?: string;
    maxHeight?: string;
    maxDigDepth?: string;
    maxLoad?: string;
    maxPush?: string;
    fuelType?: string;
    transmission?: string;
    cabinType?: string;
    operator?: string;
    // Новые поля
    loadCapacity?: string;
    centerOfGravity?: string;
    loadingType?: string;
    manufacturerCountry?: string;
    engineType?: string;
    engineManufacturer?: string;
    engineModel?: string;
    engineCountry?: string;
    overallWidth?: string;
    turningRadius?: string;
    maxGradient?: string;
    liftingSpeedWithLoad?: string;
    liftingSpeedWithoutLoad?: string;
    loweringSpeedWithLoad?: string;
    loweringSpeedWithoutLoad?: string;
    drivingSpeedWithLoad?: string;
    drivingSpeedWithoutLoad?: string;
    frontTireSize?: string;
    rearTireSize?: string;
    clearance?: string;
    totalMass?: string;
    // Характеристики для кранов
    technology?: string;
    liftingCapacity?: string;
    boomLength?: string;
    boomPlusJibLength?: string;
    controlType?: string;
    boomLiftingSpeed?: string;
    outriggersCount?: string;
    bridgeTechnology?: string;
    safetySystem?: string;
    balancingValves?: string;
    sensors?: string;
    hoses?: string;
    dimensions?: string;
    ownWeight?: string;
    engineModel2?: string;
    enginePower2?: string;
    equipment?: string;
    // Характеристики для самосвалов/грузовиков/миксеров
    wheelFormula?: string;
    averageSpeed?: string;
    bodyDimensions?: string;
    bodyBottomThickness?: string;
    bodySideThickness?: string;
    gearbox?: string;
    rearAxle?: string;
    frontAxle?: string;
    tires?: string;
    fuelTank?: string;
    suspension?: string;
    // Характеристики для миксеров
    tankVolume?: string;
    fuelFilter?: string;
    brakeSystem?: string;
    mixingPlant?: string;
    reducer?: string;
    hydraulicPump?: string;
    hydraulicMotor?: string;
    exportVersion?: string;
    // Характеристики для манипуляторов
    chassisLoadCapacity?: string;
    steeringSystem?: string;
    drivingAxle?: string;
    bodySize?: string;
    sideWallThickness?: string;
    bottomSheetThickness?: string;
    kmuCapacity?: string;
    boomLength2?: string;
    cradle?: string;
    doubleFrame?: string;
    // Характеристики для полуприцепов
    trailerVolume?: string;
    trailerDimensions?: string;
    trailerInnerDimensions?: string;
    trailerLoadCapacity?: string;
    trailerBottomPlate?: string;
    trailerSidePlate?: string;
    trailerMainBeam?: string;
    trailerAxle?: string;
    trailerTires?: string;
    trailerHydraulicCylinder?: string;
    trailerColor?: string;
    // Характеристики для трала
    lowbedExportVersion?: string;
    lowbedLoadCapacity?: string;
    lowbedAxleCount?: string;
    lowbedAxleDistance?: string;
    lowbedPlatformHeight?: string;
    lowbedSuspension?: string;
    lowbedTires?: string;
    lowbedRamps?: string;
    lowbedWidth?: string;
    lowbedWorkingLength?: string;
    lowbedTotalLength?: string;
    lowbedTotalHeight?: string;
    lowbedTotalWidth?: string;
    lowbedMass?: string;
    lowbedEquipment?: string;
    // Характеристики для цементовоза
    cementExportVersion?: string;
    cementDimensions?: string;
    cementHeadThickness?: string;
    cementTankThickness?: string;
    cementAxle?: string;
    cementAirCompressor?: string;
    cementDieselEngine?: string;
    cementTires?: string;
    cementCapacity?: string;
    // Характеристики для фронтального погрузчика
    loaderTechnology?: string;
    loaderLoadCapacity?: string;
    loaderOperatingMass?: string;
    loaderDimensions?: string;
    loaderBucketVolume?: string;
    loaderEngine?: string;
    loaderControl?: string;
    loaderDumpHeight?: string;
    loaderBucketForce?: string;
    loaderBrakeSystem?: string;
    loaderDumpDistance?: string;
    loaderHydraulicCapacity?: string;
    loaderGears?: string;
    loaderTires?: string;
    loaderEquipment?: string;
    // 5 дополнительных кастомных полей
    custom1?: string;
    custom2?: string;
    custom3?: string;
    custom4?: string;
    custom5?: string;
  };
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

export function AdminPage() {
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | string | null>(null);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState<Partial<Equipment>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    main: true,
    engine: false,
    dimensions: false,
    operational: false,
    wheels: false,
    weight: false,
    crane: false,
    truck: false,
    mixer: false,
    manipulator: false,
    trailer: false,
    lowbed: false,
    cement: false,
    loader: false,
    custom: false,
  });
  const [addingToCategoryId, setAddingToCategoryId] = useState<string | null>(null);
  const [newEquipmentData, setNewEquipmentData] = useState<Partial<Equipment> & { photoFiles?: File[] }>({});
  const [editPhotoFiles, setEditPhotoFiles] = useState<File[]>([]);
  const [showReinitDialog, setShowReinitDialog] = useState(false);

  // Manager management state
  const [managers, setManagers] = useState<Array<{id: string, name: string, phone: string}>>([]);
  const [editingManagerId, setEditingManagerId] = useState<string | null>(null);
  const [managerFormData, setManagerFormData] = useState<{name: string, phone: string}>({name: '', phone: ''});
  const [addingManager, setAddingManager] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  // Reinitialize equipment data
  const handleReinitData = async () => {
    try {
      setSaving('reinit');
      console.log('Admin: Reinitializing equipment data...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment/reinit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Admin: ✓ Reinit response:', data);
      
      if (data.success) {
        alert(`Успешно! Обновлено ${data.count || 0} единиц техники`);
      }
      
      // Refresh the equipment list
      const refreshResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        setEquipmentList(refreshData.data.sort((a: Equipment, b: Equipment) => {
          const aId = typeof a.id === 'number' ? a.id : 0;
          const bId = typeof b.id === 'number' ? b.id : 0;
          return aId - bId;
        }));
        console.log('Admin: ✓ Data reinitialized and refreshed');
      }
    } catch (error) {
      console.error('Admin: ❌ Error reinitializing data:', error);
      alert('Ошибка при обновлении данных');
    } finally {
      setSaving(null);
    }
  };

  // Map icon names to Lucide React components
  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'building2': <Building2 className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#FE8A02' }} />,
      'pickaxe': <Pickaxe className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#FE8A02' }} />,
      'hard-hat': <HardHat className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#FE8A02' }} />,
      'truck': <Truck className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#FE8A02' }} />,
      'construction': <Construction className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#FE8A02' }} />,
      'package': <Package className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#FE8A02' }} />,
    };
    
    return iconMap[iconName] || <Construction className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#FE8A02' }} />;
  };

  // Fetch equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        console.log('Admin: Fetching equipment from server...');
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Admin: ✓ Received data from server:', data);
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Логируем photoUrls для каждого оборудования
          console.log('PHOTO URLS IN LOADED DATA:');
          data.data.forEach((item: Equipment) => {
            if (item.photoUrls && item.photoUrls.length > 0) {
              console.log(`  ✅ ${item.name}: ${item.photoUrls.length} фото`);
            } else {
              console.log(`  ❌ ${item.name}: NO PHOTOS`);
            }
          });
          
          setEquipmentList(data.data.sort((a: Equipment, b: Equipment) => {
            const aId = typeof a.id === 'number' ? a.id : 0;
            const bId = typeof b.id === 'number' ? b.id : 0;
            return aId - bId;
          }));
          console.log(`Admin: ✓ Loaded ${data.data.length} equipment items`);
        } else {
          throw new Error('Server returned invalid data');
        }
      } catch (error) {
        console.error('Admin: ❌ Error fetching equipment:', error);
        setEquipmentList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Admin: Fetching categories from server...');
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/categories`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Admin: ✓ Received data from server:', data);
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
          console.log(`Admin: ✓ Loaded ${data.data.length} categories`);
        } else {
          throw new Error('Server returned invalid data');
        }
      } catch (error) {
        console.error('Admin: ❌ Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch managers data
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/managers`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setManagers(data.data);
          console.log(`Admin: ✓ Loaded ${data.data.length} managers`);
        }
      } catch (error) {
        console.error('Admin: ❌ Error fetching managers:', error);
      }
    };

    fetchManagers();
  }, []);

  // Manager CRUD operations
  const handleAddManager = async () => {
    try {
      if (!managerFormData.name || !managerFormData.phone) {
        alert('Заполните все поля');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/managers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(managerFormData),
        }
      );

      const result = await response.json();
      if (result.success) {
        setManagers([...managers, result.data]);
        setManagerFormData({name: '', phone: ''});
        setAddingManager(false);
      }
    } catch (error) {
      console.error('Error adding manager:', error);
      alert('Ошибка при добавлении менеджера');
    }
  };

  const handleUpdateManager = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/managers/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(managerFormData),
        }
      );

      const result = await response.json();
      if (result.success) {
        setManagers(managers.map(m => m.id === id ? result.data : m));
        setEditingManagerId(null);
        setManagerFormData({name: '', phone: ''});
      }
    } catch (error) {
      console.error('Error updating manager:', error);
      alert('Ошибка при обновлении менеджера');
    }
  };

  const handleDeleteManager = async (id: string) => {
    if (!confirm('Удалить менеджера?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/managers/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setManagers(managers.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error('Error deleting manager:', error);
      alert('Ошибка при удалении менеджера');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Group equipment by category
  const equipmentByCategory = equipmentList.reduce((acc, equipment) => {
    const categoryId = equipment.categoryId || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(equipment);
    return acc;
  }, {} as Record<string, Equipment[]>);

  const handleEdit = (equipment: Equipment) => {
    setEditingId(equipment.id);
    setFormData(equipment);
    setExpandedSections({
      main: true,
      engine: false,
      dimensions: false,
      operational: false,
      wheels: false,
      weight: false,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
    setEditPhotoFiles([]);
  };

  const handleDelete = async (id: number | string, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить "${name}"?\n\nЭто действие нельзя отменить. Техника будет удалена из базы данных вместе со всеми фотографиями.`)) {
      return;
    }

    setSaving(id);
    try {
      console.log(`Admin: Deleting equipment ${id}...`);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Admin: ✓ Delete response:', data);

      if (data.success) {
        // Remove from local state
        setEquipmentList(prev => prev.filter(eq => eq.id !== id));
        alert('Техника успешно удалена!');
      } else {
        throw new Error(data.error || 'Failed to delete equipment');
      }
    } catch (error) {
      console.error('Admin: ❌ Error deleting equipment:', error);
      alert(`Ошибка при удалении: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSaving(null);
      setEditingId(null);
      setFormData({});
    }
  };

  const handleSave = async (id: number | string) => {
    setSaving(id);
    try {
      console.log(`UPDATE FUNCTION: Updating equipment ${id}...`);
      console.log('Admin: editPhotoFiles state:', editPhotoFiles);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            pricePerDay: formData.pricePerDay,
            specs: formData.specs,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Admin: ✓ Update response:', data);
      console.log('AFTER UPDATE: PhotoUrls in response:', data.data?.photoUrls);
      
      if (data.success) {
        // Upload photos if provided
        if (editPhotoFiles.length > 0) {
          console.log(`Admin: Uploading ${editPhotoFiles.length} photo(s) for equipment:`, id);
          const photoFormData = new FormData();

          // Append up to 3 photos
          editPhotoFiles.slice(0, 3).forEach((file, index) => {
            photoFormData.append(`photo${index + 1}`, file);
          });
          
          const photoResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment/${id}/photos`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${publicAnonKey}`,
              },
              body: photoFormData,
            }
          );
          
          const photoData = await photoResponse.json();
          console.log('UPDATE: Photos upload response:', photoData);
          console.log('UPDATE: Photo URLs from response:', photoData.data?.photoUrls);
          
          if (photoResponse.ok && photoData.success && photoData.data) {
            console.log('UPDATE: ✓ Photos uploaded successfully');
            
            // Immediately update the equipment in the list with the new photo URL
            setEquipmentList(prev => prev.map(eq => 
              eq.id === id ? { ...eq, photoUrls: photoData.data.photoUrls } : eq
            ));
            console.log('UPDATE: ✓ Photo URLs updated in UI immediately');
          } else {
            console.error('Admin: ❌ Failed to upload photos:', photoData);
          }
        }
        
        console.log('UPDATE: Fetching refreshed equipment list...');
        // Refresh the list
        const refreshResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        const refreshData = await refreshResponse.json();
        console.log('UPDATE: Refresh data response:', refreshData);
        if (refreshData.success) {
          const updatedEquipment = refreshData.data.find((e: Equipment) => e.id === id);
          console.log('UPDATE: Updated equipment data:', updatedEquipment);
          console.log('UPDATE: Updated equipment photoUrls:', updatedEquipment?.photoUrls);
          
          setEquipmentList(refreshData.data.sort((a: Equipment, b: Equipment) => {
            const aId = typeof a.id === 'number' ? a.id : 0;
            const bId = typeof b.id === 'number' ? b.id : 0;
            return aId - bId;
          }));
        }
        setEditingId(null);
        setFormData({});
        setEditPhotoFiles([]);
        console.log('UPDATE: ✓ Equipment updated successfully');
      }
    } catch (error) {
      console.error('Admin: ❌ Error updating equipment:', error);
      alert('Ошибка при обновлении данных. Проверьте консоль для деталей.');
    } finally {
      setSaving(null);
    }
  };

  const handleCreateEquipment = async (categoryId: string) => {
    setSaving('new');
    try {
      console.log(`Admin: Creating new equipment for category ${categoryId}...`);
      
      // Validate required fields
      if (!newEquipmentData.name || !newEquipmentData.brandId || !newEquipmentData.pricePerDay) {
        alert('Пожалуйста, заполните все обязательные поля: Название, Бренд и Цена');
        setSaving(null);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            categoryId,
            brandId: newEquipmentData.brandId,
            name: newEquipmentData.name,
            pricePerDay: newEquipmentData.pricePerDay,
            specs: {
              capacity: newEquipmentData.specs?.capacity || '',
              weight: '',
              ...newEquipmentData.specs
            },
          }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Admin: ✓ Create response:', data);
      
      if (data.success) {
        // Upload photos if provided
        if (newEquipmentData.photoFiles && newEquipmentData.photoFiles.length > 0 && data.data.id) {
          console.log(`Admin: Uploading ${newEquipmentData.photoFiles.length} photo(s) for new equipment:`, data.data.id);
          const photoFormData = new FormData();

          // Append up to 3 photos
          newEquipmentData.photoFiles.slice(0, 3).forEach((file, index) => {
            photoFormData.append(`photo${index + 1}`, file);
          });

          const photoResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment/${data.data.id}/photos`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${publicAnonKey}`,
              },
              body: photoFormData,
            }
          );
          
          const photoData = await photoResponse.json();
          console.log('Admin: Photo upload response:', photoData);
          
          if (photoResponse.ok && photoData.success) {
            console.log('Admin: ✓ Photos uploaded successfully');
          } else {
            console.error('Admin: ❌ Failed to upload photos:', photoData);
            alert(`Предупреждение: техника добавлена, но фото не загружено: ${photoData.error || 'Неизвестная ошибка'}`);
          }
        }
        
        // Refresh the list
        const refreshResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/equipment`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setEquipmentList(refreshData.data.sort((a: Equipment, b: Equipment) => {
            const aId = typeof a.id === 'number' ? a.id : 0;
            const bId = typeof b.id === 'number' ? b.id : 0;
            return aId - bId;
          }));
        }
        
        // Reset form
        setAddingToCategoryId(null);
        setNewEquipmentData({});
        console.log('Admin: ✓ Equipment created successfully');
        alert('Техника успешно добавлена!');
      }
    } catch (error) {
      console.error('Admin: ❌ Error creating equipment:', error);
      alert('Ошибка при создании техники. Проверьте консоль для деталей.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (equipmentList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <div className="text-xl text-gray-900 mb-2">Не удалось загрузить данные</div>
          <div className="text-gray-600 mb-4">Проверьте консоль для деталей</div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RotateCcw className="w-4 h-4" />
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with blue gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-6xl mx-auto py-4 sm:py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Назад к генератору КП
            </button>
            <div className="flex gap-2">
              {/* TEMPORARILY HIDDEN FOR TESTING - UNCOMMENT AFTER FIXING PHOTO BUG
              <button
                onClick={() => setShowReinitDialog(true)}
                disabled={saving === 'reinit'}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50"
              >
                {saving === 'reinit' ? (
                  <>
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Реинициализация...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Реинициализация данных
                  </>
                )}
              </button>
              */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                Выйти
              </button>
            </div>
          </div>
          
          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <img src={logoImage} alt="SPEC Logo" className="h-16 sm:h-20 object-contain" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center sm:text-left">
            Админ-панель
          </h1>
          <p className="text-sm sm:text-base text-white/80 text-center sm:text-left">Управление техникой и ценами</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
        {/* Equipment List */}
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryEquipment = equipmentByCategory[category.id] || [];
            const isExpanded = expandedCategories[category.id];
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-4xl">{getCategoryIcon(category.icon)}</div>
                    <div className="text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{categoryEquipment.length} {categoryEquipment.length === 1 ? 'единица' : categoryEquipment.length < 5 ? 'единицы' : 'единиц'}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {/* Category Equipment List */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 sm:p-6 space-y-4 bg-gray-50">
                    {/* Existing Equipment */}
                    {categoryEquipment.length > 0 && categoryEquipment.map((equipment) => (
                      <motion.div
                        key={equipment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-md p-6"
                      >
                        {editingId === equipment.id ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="text-4xl">{equipment.icon}</div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {equipment.name}
                                </h3>
                                <p className="text-sm text-gray-500">ID: {equipment.id}</p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Цена (₸)
                              </label>
                              <input
                                type="number"
                                value={formData.pricePerDay ?? 0}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    pricePerDay: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Фото техники (до 3 штук, рекомендуемый размер: 800x600 px)
                              </label>

                              {/* Preview selected photos */}
                              {editPhotoFiles.length > 0 && (
                                <div className="mb-3 flex gap-2 flex-wrap">
                                  {editPhotoFiles.map((file, index) => (
                                    <div key={index} className="relative">
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newFiles = editPhotoFiles.filter((_, i) => i !== index);
                                          setEditPhotoFiles(newFiles);
                                        }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {editPhotoFiles.length < 3 && (
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    console.log(`Admin: ${files.length} file(s) selected`);
                                    if (files.length > 0) {
                                      // Add new files to existing ones, limit to 3 total
                                      const newFiles = [...editPhotoFiles, ...files].slice(0, 3);
                                      setEditPhotoFiles(newFiles);
                                      console.log(`Admin: Total files: ${newFiles.length}`);
                                      // Reset input
                                      e.target.value = '';
                                    }
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {editPhotoFiles.length === 3
                                  ? '✓ Максимум 3 фото выбрано. Удалите фото, чтобы добавить новое.'
                                  : `Выбрано: ${editPhotoFiles.length} из 3 фото. Форматы: JPG, PNG, WEBP`
                                }
                              </p>
                            </div>

                            {/* Основные параметры - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('main')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Основные параметры</span>
                                {expandedSections.main ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.main && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Грузоподъемность
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loadCapacity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loadCapacity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 5 тонн"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Центр тяжести
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.centerOfGravity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, centerOfGravity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 500 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Тип погрузки
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loadingType || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loadingType: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Боковая"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Страна производителя
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.manufacturerCountry || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, manufacturerCountry: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Китай"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Двигатель - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('engine')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Двигатель</span>
                                {expandedSections.engine ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.engine && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Тип двигателя
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.engineType || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, engineType: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Дизельный"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Производитель двигателя
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.engineManufacturer || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, engineManufacturer: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Cummins"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Модель двигателя
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.engineModel || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, engineModel: e.target.value },
                                        })
                                      }
                                      placeholder="Например: QSB6.7"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Страна производства двигателя
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.engineCountry || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, engineCountry: e.target.value },
                                        })
                                      }
                                      placeholder="Например: США"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Мощность двигателя
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.enginePower || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, enginePower: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 120 л.с."
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Габариты - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('dimensions')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Габариты</span>
                                {expandedSections.dimensions ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.dimensions && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Габаритная ширина
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.overallWidth || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, overallWidth: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 2500 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Эксплуатационные параметры - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('operational')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Эксплуатационные параметры</span>
                                {expandedSections.operational ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.operational && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Внешний радиус разворота
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.turningRadius || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, turningRadius: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 3500 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Максимальный преодолеваемый уклон
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.maxGradient || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, maxGradient: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 30%"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Скорость подъема (с грузом)
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.liftingSpeedWithLoad || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, liftingSpeedWithLoad: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 0.5 м/с"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Скорость подъема (без груза)
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.liftingSpeedWithoutLoad || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, liftingSpeedWithoutLoad: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 0.6 м/с"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Скорость опускания (с грузом)
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loweringSpeedWithLoad || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loweringSpeedWithLoad: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 0.4 м/с"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Скорость опускания (без груза)
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loweringSpeedWithoutLoad || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loweringSpeedWithoutLoad: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 0.5 м/с"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Скорость движения (с грузом)
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.drivingSpeedWithLoad || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, drivingSpeedWithLoad: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 15 км/ч"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Скорость движения (без груза)
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.drivingSpeedWithoutLoad || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, drivingSpeedWithoutLoad: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 20 км/ч"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Колеса - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('wheels')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Колеса</span>
                                {expandedSections.wheels ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.wheels && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Размер передних шин
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.frontTireSize || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, frontTireSize: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 7.00-12"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Размер задних шин
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.rearTireSize || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, rearTireSize: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 6.50-10"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Клиренс
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.clearance || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, clearance: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 120 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Вес - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('weight')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Вес</span>
                                {expandedSections.weight ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.weight && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Полная масса
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.totalMass || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, totalMass: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 12 тонн"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Характеристики кранов - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('crane')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Характеристики кранов</span>
                                {expandedSections.crane ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.crane && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Технология
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.technology || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, technology: e.target.value },
                                        })
                                      }
                                      placeholder="Например: LIEBHERR (Германия)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Грузоподъёмность
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.liftingCapacity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, liftingCapacity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 25 000 кг"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Полностью выпущенная стрела
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.boomLength || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, boomLength: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 39,5 метр"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Полностью выпущ. стрела+гусек
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.boomPlusJibLength || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, boomPlusJibLength: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 48,5 метр"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Управление
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.controlType || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, controlType: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Джойстиковое управление"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Скорость поднятия стрелы
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.boomLiftingSpeed || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, boomLiftingSpeed: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 75сек"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Количество аутригеров
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.outriggersCount || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, outriggersCount: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 5 шт"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Мост
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.bridgeTechnology || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, bridgeTechnology: e.target.value },
                                        })
                                      }
                                      placeholder="Например: MERRITOR (технология США)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Система безопасности
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.safetySystem || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, safetySystem: e.target.value },
                                        })
                                      }
                                      placeholder="Например: PAT (Германия)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Клапаны балансирующие
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.balancingValves || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, balancingValves: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Италия"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Датчики
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.sensors || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, sensors: e.target.value },
                                        })
                                      }
                                      placeholder="Например: HIRSCHMANN (Германия)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Шланги
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.hoses || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, hoses: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Manuli, Sunflex"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Габариты
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.dimensions || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, dimensions: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 12870 * 2550 * 3470мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Собственный вес в движении
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.ownWeight || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, ownWeight: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 31 000 кг"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Модель двигателя
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.engineModel2 || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, engineModel2: e.target.value },
                                        })
                                      }
                                      placeholder="Например: MC07H.32-50"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Мощность двигателя
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.enginePower2 || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, enginePower2: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 221 кВт"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Комплектация
                                    </label>
                                    <textarea
                                      value={formData.specs?.equipment || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, equipment: e.target.value },
                                        })
                                      }
                                      placeholder="Например: кондиционер, печка в кабине водителя, климат-контроль в кабине оператора, ЗИП ящик в заводской комплектации"
                                      rows={3}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Характеристики самосвалов/грузовиков - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('truck')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Характеристики самосвалов/грузовиков</span>
                                {expandedSections.truck ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.truck && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Колесная формула
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.wheelFormula || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, wheelFormula: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 6х4"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Средняя скорость
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.averageSpeed || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, averageSpeed: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 80 км/час"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Размеры кузова (ДхШхВ)
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.bodyDimensions || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, bodyDimensions: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 5800 х 2300 х 1500 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Толщина днища кузова
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.bodyBottomThickness || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, bodyBottomThickness: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 8 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Толщина боковины кузова
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.bodySideThickness || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, bodySideThickness: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 4 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      КПП
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.gearbox || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, gearbox: e.target.value },
                                        })
                                      }
                                      placeholder="Например: механика 12JSD180T, 12-ти ступка"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Задний мост
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.rearAxle || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, rearAxle: e.target.value },
                                        })
                                      }
                                      placeholder="Например: MAN 16 тн"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Передняя ось
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.frontAxle || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, frontAxle: e.target.value },
                                        })
                                      }
                                      placeholder="Например: MAN 7.5 тн"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Шины
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.tires || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, tires: e.target.value },
                                        })
                                      }
                                      placeholder="Например: МЕТАЛЛОКОРД 12.00-R20"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Топливный бак
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.fuelTank || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, fuelTank: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 400 л"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Подвеска
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.suspension || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, suspension: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 4 усиленные стремянки на рессорах"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Характеристики миксеров - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('mixer')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Характеристики миксеров</span>
                                {expandedSections.mixer ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.mixer && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Экспортный вариант
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.exportVersion || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, exportVersion: e.target.value },
                                        })
                                      }
                                      placeholder="Например: ЭКСПОРТНЫЙ ВАРИАНТ"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Объем цистерны
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.tankVolume || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, tankVolume: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 10 куб.м."
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Топливный фильтр
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.fuelFilter || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, fuelFilter: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Parker первого уровня"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Тормозная система
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.brakeSystem || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, brakeSystem: e.target.value },
                                        })
                                      }
                                      placeholder="Например: WABKO ABS (4S/4M)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Смесительная установка
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.mixingPlant || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, mixingPlant: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Редуктор: TOP P68"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Редуктор
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.reducer || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, reducer: e.target.value },
                                        })
                                      }
                                      placeholder="Например: TOP P68"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Гидравлический насос
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.hydraulicPump || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, hydraulicPump: e.target.value },
                                        })
                                      }
                                      placeholder="Например: ARK PV089"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Гидравлический двигатель
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.hydraulicMotor || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, hydraulicMotor: e.target.value },
                                        })
                                      }
                                      placeholder="Например: ARK MF089"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Характеристики манипуляторов - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('manipulator')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Характеристики манипуляторов</span>
                                {expandedSections.manipulator ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.manipulator && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Грузоподъемность шасси
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.chassisLoadCapacity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, chassisLoadCapacity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 20 000 кг"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Рулевая машина
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.steeringSystem || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, steeringSystem: e.target.value },
                                        })
                                      }
                                      placeholder="Например: BOSCH"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Ведущий мост
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.drivingAxle || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, drivingAxle: e.target.value },
                                        })
                                      }
                                      placeholder="Например: MCJ13BGS"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Размеры кузова (ДхШхВ)
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.bodySize || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, bodySize: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 8000х2300х600 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Толщина боковых стенок
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.sideWallThickness || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, sideWallThickness: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 1.5 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Толщина нижнего листа
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.bottomSheetThickness || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, bottomSheetThickness: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 5 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Грузоподъемность КМУ
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.kmuCapacity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, kmuCapacity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 12 тонн"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Длина стрелы
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.boomLength2 || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, boomLength2: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 12.5 м"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Люлька
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cradle || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cradle: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Люлька в комплекте"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Двухслойная рама
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.doubleFrame || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, doubleFrame: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Двухслойная рама, ABS (4S/4M)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Характеристики полуприцепов - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('trailer')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Характеристики полуприцепов</span>
                                {expandedSections.trailer ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.trailer && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Объем
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerVolume || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerVolume: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 41,6 Куб"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Размеры
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerDimensions || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerDimensions: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 10500×2720×3500(mm)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Внутренние размеры
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerInnerDimensions || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerInnerDimensions: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 9200*2530*1800MM, 41,6 m³"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Грузоподъемность
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerLoadCapacity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerLoadCapacity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 40-60T"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Нижняя пластина
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerBottomPlate || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerBottomPlate: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 8 MM"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Боковая пластина
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerSidePlate || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerSidePlate: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 6 MM"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Основной лонжерон
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerMainBeam || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerMainBeam: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 14mm,8mm,16mm"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Ось
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerAxle || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerAxle: e.target.value },
                                        })
                                      }
                                      placeholder="Например: FUWA 4*13T, 4 Ось пневматическая подвеска"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Шины
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerTires || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerTires: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 385 65 R22.5 16+1 PCS"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Гидравлический цилиндр
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerHydraulicCylinder || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerHydraulicCylinder: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Один 200# гидравлический цилиндр"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Цвет
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.trailerColor || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, trailerColor: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Серый"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Характеристики трала - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('lowbed')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Характеристики трала</span>
                                {expandedSections.lowbed ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.lowbed && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Экспортный вариант
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedExportVersion || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedExportVersion: e.target.value },
                                        })
                                      }
                                      placeholder="Например: ЭКСПОРТНЫЙ ВАРИАНТ"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Грузоподъемность
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedLoadCapacity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedLoadCapacity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 70 000 кг"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Количество осей
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedAxleCount || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedAxleCount: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 4"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Расстояние между осями
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedAxleDistance || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedAxleDistance: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 1,31 м"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Высота платформы
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedPlatformHeight || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedPlatformHeight: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 90 см"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Подвеска
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedSuspension || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedSuspension: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Рессорная подвеска"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Шины
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedTires || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedTires: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 235/75 R17.50 (Металлокорд)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Трапы
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedRamps || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedRamps: e.target.value },
                                        })
                                      }
                                      placeholder="Например: механические"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Ширина трала
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedWidth || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedWidth: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 2,5 м + уширители (+0,5 м)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Рабочая длина
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedWorkingLength || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedWorkingLength: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 12 000 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Общая длина
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedTotalLength || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedTotalLength: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 16 000 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Общая высота
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedTotalHeight || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedTotalHeight: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 3 200 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Ширина
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedTotalWidth || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedTotalWidth: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 2 500 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Масса
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedMass || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedMass: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 12 000 кг"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Комплектация
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.lowbedEquipment || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, lowbedEquipment: e.target.value },
                                        })
                                      }
                                      placeholder="Например: ЗИП ящик в заводской комплектации"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Характеристики цементовоза - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('cement')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Характеристики цементовоза</span>
                                {expandedSections.cement ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.cement && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Экспортный вариант
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cementExportVersion || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cementExportVersion: e.target.value },
                                        })
                                      }
                                      placeholder="Например: ЭКСПОРТНЫЙ ВАРИАНТ"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Размеры
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cementDimensions || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cementDimensions: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 10300*2500*3900"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Толщина головки
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cementHeadThickness || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cementHeadThickness: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 4MM Толщина"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Толщина бака
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cementTankThickness || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cementTankThickness: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 4 MM Толщина"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Ось
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cementAxle || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cementAxle: e.target.value },
                                        })
                                      }
                                      placeholder="Например: FUWA 4*13T, Тяжелая механическая подвеска"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Воздушный компрессор
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cementAirCompressor || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cementAirCompressor: e.target.value },
                                        })
                                      }
                                      placeholder="Например: BOHAI 12m³"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Дизельный двигатель
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cementDieselEngine || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cementDieselEngine: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Weichai4102"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Шины
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cementTires || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cementTires: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 12R22.5 16 PCS, С запасной шиной"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Емкость
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.cementCapacity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, cementCapacity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 45 куб."
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Характеристики фронтального погрузчика - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('loader')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Характеристики фронтального погрузчика</span>
                                {expandedSections.loader ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.loader && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Технология
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderTechnology || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderTechnology: e.target.value },
                                        })
                                      }
                                      placeholder="Например: CATERPILLAR (USA)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Грузоподъемность
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderLoadCapacity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderLoadCapacity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 3 500 кг"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Эксплуатационная масса
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderOperatingMass || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderOperatingMass: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 10 400 кг (± 200кг)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Габариты (Д×Ш×В)
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderDimensions || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderDimensions: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 7450x2482x2482 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Объем ковша
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderBucketVolume || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderBucketVolume: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 2.1 куб.м."
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Двигатель
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderEngine || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderEngine: e.target.value },
                                        })
                                      }
                                      placeholder="Например: SC7H130G2B Shanghai"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Управление
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderControl || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderControl: e.target.value },
                                        })
                                      }
                                      placeholder="Например: ДЖОЙСТИКОВОЕ"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Высота выгрузки
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderDumpHeight || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderDumpHeight: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 2900 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Макс.усилие ковша
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderBucketForce || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderBucketForce: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 115 кН"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Тормозная система
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderBrakeSystem || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderBrakeSystem: e.target.value },
                                        })
                                      }
                                      placeholder="Например: дисковая"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Дальность выгрузки
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderDumpDistance || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderDumpDistance: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 1030 мм"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Заправочная емкость гидравлики
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderHydraulicCapacity || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderHydraulicCapacity: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 155 л"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Количество передач
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderGears || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderGears: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 4 вперед, 2 назад"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Шины
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderTires || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderTires: e.target.value },
                                        })
                                      }
                                      placeholder="Например: 17,5–25 (12-слоев)"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Комплектация
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.loaderEquipment || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, loaderEquipment: e.target.value },
                                        })
                                      }
                                      placeholder="Например: Система холодного запуска, кондиционер, печка"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Дополнительные поля - Collapsible */}
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection('custom')}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-semibold text-gray-900">Дополнительные характеристики</span>
                                {expandedSections.custom ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                              {expandedSections.custom && (
                                <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Доп. поле 1
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.custom1 || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, custom1: e.target.value },
                                        })
                                      }
                                      placeholder="Любое значение"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Доп. поле 2
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.custom2 || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, custom2: e.target.value },
                                        })
                                      }
                                      placeholder="Любое значение"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Доп. поле 3
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.custom3 || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, custom3: e.target.value },
                                        })
                                      }
                                      placeholder="Любое значение"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Доп. поле 4
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.custom4 || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, custom4: e.target.value },
                                        })
                                      }
                                      placeholder="Любое значение"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Доп. поле 5
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.specs?.custom5 || ''}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          specs: { ...formData.specs!, custom5: e.target.value },
                                        })
                                      }
                                      placeholder="Любое значение"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => handleSave(equipment.id)}
                                disabled={saving === equipment.id}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {saving === equipment.id ? (
                                  <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Сохранение...
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-5 h-5" />
                                    Сохранить
                                  </>
                                )}
                              </button>
                              <button
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Отмена
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex items-start gap-3 sm:gap-4 flex-1">
                              <div className="text-3xl sm:text-4xl flex-shrink-0">{equipment.icon}</div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                  {equipment.name}
                                </h3>
                                <div className="mb-3">
                                  <span className="text-xl sm:text-2xl font-bold text-blue-600">
                                    {(equipment.pricePerDay ?? 0).toLocaleString()} ₸
                                  </span>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                  <p>• Производитель: {equipment.specs.brand || 'N/A'}</p>
                                  <p>• Год: {equipment.specs.year || 'N/A'}</p>
                                  <p>• Вместимость/параметры: {equipment.specs.capacity}</p>
                                  {equipment.specs.loadCapacity && <p>• Грузоподъемность: {equipment.specs.loadCapacity}</p>}
                                </div>
                                
                                {/* Photos Display */}
                                {equipment.photoUrls && equipment.photoUrls.length > 0 && (
                                  <div className="mt-3 flex gap-2">
                                    {equipment.photoUrls.map((url, index) => (
                                      <img
                                        key={index}
                                        src={url}
                                        alt={`${equipment.name} - фото ${index + 1}`}
                                        className="w-24 h-24 rounded-lg shadow-md object-cover"
                                        onError={(e) => {
                                          console.error(`Admin: Failed to load image ${index + 1}:`, url);
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => handleEdit(equipment)}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                              >
                                Редактировать
                              </button>
                              <button
                                onClick={() => handleDelete(equipment.id, equipment.name)}
                                disabled={saving === equipment.id}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                {saving === equipment.id ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Trash2 className="w-4 h-4" />
                                    <span>Удалить</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* Add New Equipment Button and Form */}
                    {addingToCategoryId === category.id ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-md p-6"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Добавить новую технику</h3>
                            <button
                              onClick={() => {
                                setAddingToCategoryId(null);
                                setNewEquipmentData({});
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5 text-gray-500" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Название техники <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newEquipmentData.name || ''}
                              onChange={(e) =>
                                setNewEquipmentData({
                                  ...newEquipmentData,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Например: Погрузчик XCMG ZL50GN"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Бренд <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newEquipmentData.brandId || ''}
                              onChange={(e) =>
                                setNewEquipmentData({
                                  ...newEquipmentData,
                                  brandId: e.target.value,
                                })
                              }
                              placeholder="Например: xcmg"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Цена (₸) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={newEquipmentData.pricePerDay ?? 0}
                              onChange={(e) =>
                                setNewEquipmentData({
                                  ...newEquipmentData,
                                  pricePerDay: parseInt(e.target.value) || 0,
                                })
                              }
                              placeholder="Например: 50000"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Фото техники (до 3 штук, рекомендуемый размер: 800x600 px)
                            </label>

                            {/* Preview selected photos */}
                            {newEquipmentData.photoFiles && newEquipmentData.photoFiles.length > 0 && (
                              <div className="mb-3 flex gap-2 flex-wrap">
                                {newEquipmentData.photoFiles.map((file, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Preview ${index + 1}`}
                                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newFiles = newEquipmentData.photoFiles!.filter((_, i) => i !== index);
                                        setNewEquipmentData({
                                          ...newEquipmentData,
                                          photoFiles: newFiles,
                                        });
                                      }}
                                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(!newEquipmentData.photoFiles || newEquipmentData.photoFiles.length < 3) && (
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length > 0) {
                                    const existingFiles = newEquipmentData.photoFiles || [];
                                    const newFiles = [...existingFiles, ...files].slice(0, 3);
                                    setNewEquipmentData({
                                      ...newEquipmentData,
                                      photoFiles: newFiles,
                                    });
                                    // Reset input
                                    e.target.value = '';
                                  }
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {newEquipmentData.photoFiles?.length === 3
                                ? '✓ Максимум 3 фото выбрано. Удалите фото, чтобы добавить новое.'
                                : `Выбрано: ${newEquipmentData.photoFiles?.length || 0} из 3 фото. Форматы: JPG, PNG, WEBP`
                              }
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Основные характеристики (capacity)
                            </label>
                            <input
                              type="text"
                              value={newEquipmentData.specs?.capacity || ''}
                              onChange={(e) =>
                                setNewEquipmentData({
                                  ...newEquipmentData,
                                  specs: { ...newEquipmentData.specs, capacity: e.target.value },
                                })
                              }
                              placeholder="Например: 5 тонн"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleCreateEquipment(category.id)}
                              disabled={saving === 'new'}
                              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {saving === 'new' ? (
                                <>
                                  <Loader className="w-5 h-5 animate-spin" />
                                  Создание...
                                </>
                              ) : (
                                <>
                                  <Plus className="w-5 h-5" />
                                  Создать
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setAddingToCategoryId(null);
                                setNewEquipmentData({});
                              }}
                              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => {
                          setAddingToCategoryId(category.id);
                          setNewEquipmentData({});
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Добавить технику в категорию
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Managers Section */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white">Управление менеджерами</h2>
              <p className="text-white/80 mt-1">Добавление и редактирование контактов менеджеров</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Add Manager Button */}
              {!addingManager && (
                <button
                  onClick={() => setAddingManager(true)}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Добавить менеджера
                </button>
              )}

              {/* Add Manager Form */}
              {addingManager && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">Новый менеджер</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ФИО <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={managerFormData.name}
                        onChange={(e) => setManagerFormData({...managerFormData, name: e.target.value})}
                        placeholder="Иванов Иван Иванович"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={managerFormData.phone}
                        onChange={(e) => setManagerFormData({...managerFormData, phone: e.target.value})}
                        placeholder="+7 702 274 6797"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddManager}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Добавить
                      </button>
                      <button
                        onClick={() => {
                          setAddingManager(false);
                          setManagerFormData({name: '', phone: ''});
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Managers List */}
              <div className="space-y-3">
                {managers.map((manager) => (
                  <div
                    key={manager.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    {editingManagerId === manager.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ФИО</label>
                          <input
                            type="text"
                            value={managerFormData.name}
                            onChange={(e) => setManagerFormData({...managerFormData, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                          <input
                            type="tel"
                            value={managerFormData.phone}
                            onChange={(e) => setManagerFormData({...managerFormData, phone: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleUpdateManager(manager.id)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Сохранить
                          </button>
                          <button
                            onClick={() => {
                              setEditingManagerId(null);
                              setManagerFormData({name: '', phone: ''});
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{manager.name}</div>
                          <div className="text-sm text-gray-600">{manager.phone}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingManagerId(manager.id);
                              setManagerFormData({name: manager.name, phone: manager.phone});
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDeleteManager(manager.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {managers.length === 0 && !addingManager && (
                  <div className="text-center text-gray-500 py-8">
                    Нет добавленных менеджеров
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Диалог подтверждения реинициализации */}
      {showReinitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ⚠️ Внимание! Опасная операция
                </h3>
                <p className="text-gray-700 mb-4">
                  Вы уверены, что хотите выполнить <strong>реинициализацию данных</strong>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800 font-semibold mb-2">
                    Это действие удалит:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>Все изменённые цены</li>
                    <li>Все загруженные фотографии</li>
                    <li>Все изменённые характеристики</li>
                    <li>Все добавленные единицы техники</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Данные будут восстановлены до начального состояния. Эта операция <strong>необратима</strong>!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowReinitDialog(false);
                      handleReinitData();
                    }}
                    disabled={saving === 'reinit'}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Да, удалить все данные
                  </button>
                  <button
                    onClick={() => setShowReinitDialog(false)}
                    disabled={saving === 'reinit'}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}