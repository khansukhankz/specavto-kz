import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Plus, Trash2, FileText } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFProposal } from '../components/PDFProposal';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Manager {
  id: string;
  name: string;
  phone: string;
}

interface Equipment {
  id: string;
  categoryId: string;
  brandId: string;
  name: string;
  pricePerDay: number;
  photoUrl?: string;
  photoUrls?: string[]; // Array of up to 3 photo URLs
  specs: {
    capacity: string;
    maxHeight?: string;
    weight: string;
    enginePower?: string;
    year: string;
    fuelType?: string;
    transmission?: string;
    cabinType?: string;
    operator?: string;
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
    // 5 дополнительных кастомных полей
    custom1?: string;
    custom2?: string;
    custom3?: string;
    custom4?: string;
    custom5?: string;
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
    // Другие поля
    [key: string]: any;
  };
}

interface ProposalItem {
  equipment: Equipment;
  quantity: number;
  categoryIcon: string;
  customPrice?: number; // Optional custom price that overrides automatic calculation
  isPriceWithVAT?: boolean; // Flag to indicate if customPrice includes VAT
}

const regions = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз'];

// Preset options for dropdowns
const validUntilOptions = [
  { value: '7', label: '7 дней' },
  { value: '14', label: '14 дней' },
  { value: '30', label: '30 дней' },
  { value: 'custom', label: 'Указать дату' },
];

const additionalEquipmentOptions = [
  'Полная комплектация техники, включая все необходимые инструменты и принадлежности. Гарантийное обслуживание. Консультации специалистов.',
  'Базовая комплектация',
  'Стандартная комплектация с дополнительными инструментами',
  'Расширенная комплектация с GPS-мониторингом',
];

const deliveryOptions = [
  'Доставка по городу',
  'Доставка по области',
  'Самовывоз',
  'Доставка и монтаж на объекте',
];

const warrantyOptions = [
  'Гарантия от производителя',
  'Гарантия исправности оборудования',
  'Техническая поддержка 24/7',
  'Расширенная гарантия + ТО',
];

const deliveryTimeOptions = [
  'В наличии',
  '1-2 дня',
  '3-5 дней',
  'По согласованию',
];

const paymentTermsOptions = [
  '100% предоплата или по дооренности',
  '100% предоплата',
  '50% предоплата, 50% по завершении',
  '30% предоплата, 70% по факту',
  'Оплата по договору',
];

export function MainPage() {
  const proposalRef = useRef<HTMLDivElement>(null);
  const hiddenProposalRefs = useRef<(HTMLDivElement | null)[]>([]); // Array of refs for multiple PDFs

  // Selection state
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Equipment[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<Equipment | null>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  // Multiple proposals
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  // Form fields
  const [clientCompany, setClientCompany] = useState('');
  const [clientName, setClientName] = useState('');
  const [region, setRegion] = useState('');
  const [days, setDays] = useState(1);
  const [quantity, setQuantity] = useState(1);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Additional fields
  const [validUntilMode, setValidUntilMode] = useState('7');
  const [validUntilCustom, setValidUntilCustom] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [additionalEquipment, setAdditionalEquipment] = useState(additionalEquipmentOptions[0]);
  const [deliveryTerms, setDeliveryTerms] = useState('Самовывоз');
  const [warranty, setWarranty] = useState(warrantyOptions[0]);
  const [deliveryTime, setDeliveryTime] = useState(deliveryTimeOptions[0]);
  const [paymentTerms, setPaymentTerms] = useState(paymentTermsOptions[0]);

  const [loading, setLoading] = useState(true);

  // Calculate valid until date
  const validUntil = validUntilMode === 'custom' 
    ? validUntilCustom 
    : new Date(Date.now() + parseInt(validUntilMode) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Add proposal
  const addProposal = () => {
    if (!selectedModel) return;
    
    if (proposals.length >= 6) {
      alert('Максимум 6 коммерческих предложений');
      return;
    }

    setProposals([
      ...proposals,
      {
        equipment: selectedModel,
        quantity: currentQuantity,
        categoryIcon: getCategoryIcon(),
      }
    ]);
    
    // Reset quantity after adding
    setCurrentQuantity(1);
  };

  // Remove proposal
  const removeProposal = (index: number) => {
    setProposals(proposals.filter((_, i) => i !== index));
  };

  // Update proposal quantity
  const updateProposalQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setProposals(proposals.map((item, i) => 
      i === index 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Update custom price for proposal
  const updateProposalPrice = (index: number, newPrice: number | undefined) => {
    setProposals(proposals.map((item, i) => 
      i === index 
        ? { ...item, customPrice: newPrice }
        : item
    ));
  };

  // Toggle VAT flag for proposal
  const toggleProposalVAT = (index: number) => {
    setProposals(proposals.map((item, i) => 
      i === index 
        ? { ...item, isPriceWithVAT: !item.isPriceWithVAT }
        : item
    ));
  };

  // Calculate price for a single proposal
  const calculateProposalPrice = (proposal: ProposalItem) => {
    let totalPrice: number;
    let vat: number;
    let finalPrice: number;
    
    if (proposal.customPrice !== undefined) {
      // Custom price is set
      if (proposal.isPriceWithVAT) {
        // Checkbox ON "С НДС": add 12% VAT to the entered price
        totalPrice = proposal.customPrice;
        vat = Math.round(totalPrice * 0.12);
        finalPrice = totalPrice + vat;
      } else {
        // Checkbox OFF: price WITHOUT VAT, no VAT calculation
        totalPrice = proposal.customPrice;
        vat = 0;
        finalPrice = totalPrice;
      }
    } else {
      // Use automatic calculation (always base price + VAT)
      totalPrice = proposal.equipment.pricePerDay * proposal.quantity;
      vat = Math.round(totalPrice * 0.12);
      finalPrice = totalPrice + vat;
    }
    
    return { totalPrice, vat, finalPrice };
  };

  // Download all proposals as a single multi-page PDF
  const handleDownloadAllPDFs = async () => {
    if (proposals.length === 0) return;

    try {
      await document.fonts.ready;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      let isFirstPage = true;

      for (let i = 0; i < proposals.length; i++) {
        const ref = hiddenProposalRefs.current[i];
        if (!ref) continue;

        const canvas = await html2canvas(ref, {
          scale: 3,
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: true,
          logging: false,
          foreignObjectRendering: false,
          imageTimeout: 0,
          removeContainer: false,
          onclone: (clonedDoc) => {
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.fontFamily = 'Arial, sans-serif';
            });
          },
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add new page for each proposal except the first one
        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }

      const dateStr = new Date().toLocaleDateString('ru-RU');
      pdf.save(`КП_все_${proposals.length}_позиций_${dateStr}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Ошибка при генерации PDF');
    }
  };

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Loading categories from API...');
        console.log('API URL:', `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/categories`);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/categories`,
          { 
            headers: { 
              Authorization: `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            } 
          }
        );

        console.log('✓ Response received');
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error body:', errorText);
          throw new Error(`API вернул ошибку ${response.status}: ${errorText.substring(0, 200)}`);
        }

        const result = await response.json();
        console.log('Categories result:', result);
        
        if (result.success && result.data) {
          setCategories(result.data);
          console.log('✓ Categories loaded:', result.data.length);
        } else {
          throw new Error('API вернул некорректные данные');
        }
      } catch (error) {
        console.error('❌ Error loading categories:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : 'Unknown',
          stack: error instanceof Error ? error.stack : undefined,
        });
        
        // Set user-friendly error message
        let errorMessage = 'Не удалось загрузить данные с сервера';
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage = 'Не удалось подключиться к серверу. Проверьте соединение с интернетом.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load managers on mount
  useEffect(() => {
    const loadManagers = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/managers`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );

        const result = await response.json();
        if (result.success && result.data) {
          setManagers(result.data);
          // Select first manager by default
          if (result.data.length > 0) {
            setSelectedManager(result.data[0]);
          }
        }
      } catch (error) {
        console.error('Error loading managers:', error);
      }
    };

    loadManagers();
  }, []);

  // Load brands when category selected
  useEffect(() => {
    if (!selectedCategory) {
      setBrands([]);
      setSelectedBrand('');
      return;
    }

    const loadBrands = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/brands/${selectedCategory}`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );

        const result = await response.json();
        if (result.success) {
          setBrands(result.data);
        }
      } catch (error) {
        console.error('Error loading brands:', error);
      }
    };

    loadBrands();
  }, [selectedCategory]);

  // Load models when brand selected
  useEffect(() => {
    if (!selectedCategory || !selectedBrand) {
      setModels([]);
      setSelectedModel(null);
      return;
    }

    const loadModels = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0be467f4/models/${selectedCategory}/${selectedBrand}`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );

        const result = await response.json();
        if (result.success) {
          setModels(result.data);
        }
      } catch (error) {
        console.error('Error loading models:', error);
        console.error('Selected category:', selectedCategory);
        console.error('Selected brand:', selectedBrand);
        setModels([]);
      }
    };

    loadModels();
  }, [selectedCategory, selectedBrand]);

  // Update delivery terms when region changes
  useEffect(() => {
    if (deliveryTerms === deliveryOptions[0]) {
      setDeliveryTerms(`Доставка по г. ${region}`);
    }
  }, [region]);

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    setSelectedModel(model || null);
  };

  const getCategoryIcon = () => {
    const category = categories.find(c => c.id === selectedCategory);
    return category?.icon || '🏗️';
  };

  const handleDownloadPDF = async () => {
    if (!hiddenProposalRefs.current || proposals.length === 0) return;

    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      const canvas = await html2canvas(hiddenProposalRefs.current[0] as HTMLDivElement, {
        scale: 3, // Increased scale for better quality
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
        removeContainer: false,
        onclone: (clonedDoc) => {
          // Ensure all fonts are loaded and applied
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el: Element) => {
            const htmlEl = el as HTMLElement;
            
            // Force font to system fonts that support Cyrillic
            htmlEl.style.fontFamily = 'Arial, sans-serif';
            
            const computedStyle = window.getComputedStyle(el as HTMLElement);
            
            // Fix border colors
            if (computedStyle.borderColor && computedStyle.borderColor.includes('rgba(0, 0, 0, 0.1)')) {
              htmlEl.style.borderColor = '#e5e7eb';
            }
            if (computedStyle.borderTopColor && computedStyle.borderTopColor.includes('rgba(0, 0, 0, 0.1)')) {
              htmlEl.style.borderTopColor = '#e5e7eb';
            }
            if (computedStyle.borderBottomColor && computedStyle.borderBottomColor.includes('rgba(0, 0, 0, 0.1)')) {
              htmlEl.style.borderBottomColor = '#e5e7eb';
            }
            if (computedStyle.borderLeftColor && computedStyle.borderLeftColor.includes('rgba(0, 0, 0, 0.1)')) {
              htmlEl.style.borderLeftColor = '#e5e7eb';
            }
            if (computedStyle.borderRightColor && computedStyle.borderRightColor.includes('rgba(0, 0, 0, 0.1)')) {
              htmlEl.style.borderRightColor = '#e5e7eb';
            }
            
            // Fix background colors
            if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('rgba(0, 0, 0, 0.1)')) {
              htmlEl.style.backgroundColor = '#e5e7eb';
            }
            
            // Fix other common rgba patterns
            if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('rgba')) {
              const rgbaMatch = computedStyle.backgroundColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
              if (rgbaMatch) {
                const [, r, g, b, a] = rgbaMatch;
                const alpha = parseFloat(a);
                if (alpha < 0.01) {
                  htmlEl.style.backgroundColor = 'transparent';
                } else if (alpha < 1) {
                  // Convert rgba to approximate hex
                  htmlEl.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                  htmlEl.style.opacity = alpha.toString();
                }
              }
            }
          });
        },
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      // Create filename based on cart items
      const dateStr = new Date().toLocaleDateString('ru-RU');
      const fileName = proposals.length === 1 
        ? `КП_${proposals[0].equipment.name}_${dateStr}.pdf`
        : `КП_${proposals.length}_позиций_${dateStr}.pdf`;
      
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Ошибка при генерации PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Попробовать снова
            </button>
            <details className="text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                Технические детали
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 font-mono">
                <div>API: {`https://${projectId}.supabase.co/functions/v1/make-server-0be467f4`}</div>
                <div className="mt-2">Проверьте консоль браузера (F12) для подробностей</div>
              </div>
            </details>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button - above header */}
        <a
          href="https://specavto.kz/"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200 mb-4"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="font-medium text-sm sm:text-base">Назад</span>
        </a>
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1d4ed8' }}>
            Генератор коммерческих предложений
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Продажа спецтехники</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Selection Form */}
          <div className="space-y-6">
            {/* Equipment Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md py-6 px-4 space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Выбор техники
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория техники
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedBrand('');
                    setSelectedModel(null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && brands.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Бренд
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setSelectedModel(null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Выберите бренд</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedBrand && models.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Модель
                  </label>
                  <select
                    value={selectedModel?.id || ''}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Выберите модель</option>
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.pricePerDay.toLocaleString()} ₸
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>

            {/* Details Form */}
            <AnimatePresence>
              {selectedModel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-md p-6 space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Заполните детали КП</h2>

                  {/* Client Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Информация о клиенте</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название компании
                      </label>
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="ТОО «Название компнии»"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Контактное лицо
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Иванов Иван Иванович"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Manager Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Менеджер</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Выберите менеджера
                      </label>
                      <select
                        value={selectedManager?.id || ''}
                        onChange={(e) => {
                          const manager = managers.find(m => m.id === e.target.value);
                          setSelectedManager(manager || null);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Не выбран</option>
                        {managers.map((manager) => (
                          <option key={manager.id} value={manager.id}>
                            {manager.name} - {manager.phone}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedManager && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-sm text-gray-700">
                          <div className="font-medium">{selectedManager.name}</div>
                          <div className="text-gray-600">Тел: {selectedManager.phone}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sale Parameters */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Парамтры заказа</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Количество единиц
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={currentQuantity}
                        onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Additional Fields */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Условия предложения</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        КП действителен до
                      </label>
                      <select
                        value={validUntilMode}
                        onChange={(e) => setValidUntilMode(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        {validUntilOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {validUntilMode === 'custom' && (
                        <input
                          type="date"
                          value={validUntilCustom}
                          onChange={(e) => setValidUntilCustom(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дополнительное оснащение
                      </label>
                      <select
                        value={additionalEquipment}
                        onChange={(e) => setAdditionalEquipment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        {additionalEquipmentOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option.substring(0, 60)}...
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Условия поставки
                      </label>
                      <select
                        value={deliveryTerms}
                        onChange={(e) => setDeliveryTerms(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value={`Доставка по г. ${region}`}>Доставка по г. {region}</option>
                        {deliveryOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Гарантия
                      </label>
                      <select
                        value={warranty}
                        onChange={(e) => setWarranty(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        {warrantyOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Срок поставки
                      </label>
                      <select
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        {deliveryTimeOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Условия оплаты
                      </label>
                      <select
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        {paymentTermsOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price Preview */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Стоимость:</span>
                      <span className="font-medium">{selectedModel.pricePerDay.toLocaleString()} ₸</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">НДС 12%:</span>
                      <span className="font-medium">{Math.round(selectedModel.pricePerDay * 0.12).toLocaleString()} ₸</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-blue-600">
                      <span>Итого:</span>
                      <span>{(selectedModel.pricePerDay * 1.12).toLocaleString()} ₸</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={addProposal}
                    disabled={proposals.length >= 6}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-colors text-lg font-semibold shadow-lg hover:shadow-xl ${
                      proposals.length >= 6
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Plus className="w-6 h-6" />
                    {proposals.length >= 6 ? 'Корзина полна (макс. 6 позиций)' : 'Добавить в КП'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shopping Cart */}
            {proposals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6 space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Добавлено КП: {proposals.length}/6
                  </h2>
                  <button
                    onClick={() => setProposals([])}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Очистить всё
                  </button>
                </div>

                <div className="space-y-3">
                  {proposals.map((item, index) => {
                    const { totalPrice, vat, finalPrice } = calculateProposalPrice(item);
                    return (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">КП #{index + 1}: {item.equipment.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Количество: {item.quantity} шт
                            </div>
                          </div>
                          <button
                            onClick={() => removeProposal(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Editable Price Field */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                              Цена
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.isPriceWithVAT || false}
                                onChange={() => toggleProposalVAT(index)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-xs text-gray-600">С НДС</span>
                            </label>
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={item.customPrice !== undefined ? item.customPrice : (item.equipment.pricePerDay * item.quantity)}
                            onChange={(e) => {
                              const newPrice = parseFloat(e.target.value);
                              updateProposalPrice(index, isNaN(newPrice) ? undefined : newPrice);
                            }}
                            placeholder={item.isPriceWithVAT ? "Введите цену без НДС" : "Введите цену с НДС"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>НДС 12%: {vat.toLocaleString()} ₸</span>
                            <span className="font-semibold text-gray-900">Итого: {finalPrice.toLocaleString()} ₸</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Multiple PDF Previews */}
          <div className="space-y-6">
            {proposals.length > 0 ? (
              <>
                {/* Download All Button */}
                {proposals.length > 1 && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleDownloadAllPDFs}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
                  >
                    <Download className="w-6 h-6" />
                    Скачать все {proposals.length} КП одним файлом
                  </motion.button>
                )}

                {/* Individual Proposals */}
                {proposals.map((proposal, index) => {
                  const { finalPrice } = calculateProposalPrice(proposal);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* KP Header */}
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl flex items-center justify-between">
                        <h3 className="font-semibold">КП #{index + 1}: {proposal.equipment.name}</h3>
                        <button
                          onClick={() => removeProposal(index)}
                          className="p-1 hover:bg-blue-700 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Mobile Preview - Scaled */}
                      <div className="lg:hidden overflow-x-auto rounded-b-xl border border-gray-200 shadow-md bg-white">
                        <div className="w-full min-w-[210mm] origin-top-left scale-[0.3] sm:scale-[0.4] md:scale-[0.5]">
                          <PDFProposal
                            key={`mobile-${index}-${selectedManager?.id || 'no-manager'}`}
                            selectedItem={proposal.equipment}
                            categoryIcon={proposal.categoryIcon}
                            clientCompany={clientCompany}
                            clientName={clientName}
                            days={days}
                            quantity={proposal.quantity}
                            finalPrice={finalPrice}
                            validUntil={validUntil}
                            additionalEquipment={additionalEquipment}
                            deliveryTerms={deliveryTerms}
                            warranty={warranty}
                            deliveryTime={deliveryTime}
                            paymentTerms={paymentTerms}
                            managerName={selectedManager?.name}
                            managerPhone={selectedManager?.phone}
                            isPriceWithVAT={proposal.isPriceWithVAT}
                            customPrice={proposal.customPrice}
                          />
                        </div>
                      </div>

                      {/* Desktop Preview - Full Width No Scroll */}
                      <div className="hidden lg:block rounded-b-xl border border-gray-200 shadow-md bg-white">
                        <PDFProposal
                          key={`desktop-${index}-${selectedManager?.id || 'no-manager'}`}
                          selectedItem={proposal.equipment}
                          categoryIcon={proposal.categoryIcon}
                          clientCompany={clientCompany}
                          clientName={clientName}
                          days={days}
                          quantity={proposal.quantity}
                          finalPrice={finalPrice}
                          validUntil={validUntil}
                          additionalEquipment={additionalEquipment}
                          deliveryTerms={deliveryTerms}
                          warranty={warranty}
                          deliveryTime={deliveryTime}
                          paymentTerms={paymentTerms}
                          isFullWidth={true}
                          managerName={selectedManager?.name}
                          managerPhone={selectedManager?.phone}
                          isPriceWithVAT={proposal.isPriceWithVAT}
                          customPrice={proposal.customPrice}
                        />
                      </div>

                      <button
                        onClick={async () => {
                          // Download single PDF
                          const ref = hiddenProposalRefs.current[index];
                          if (!ref) return;
                          
                          try {
                            await document.fonts.ready;
                            const canvas = await html2canvas(ref, {
                              scale: 3,
                              backgroundColor: '#ffffff',
                              useCORS: true,
                              allowTaint: true,
                              logging: false,
                            });
                            
                            const pdf = new jsPDF('p', 'mm', 'a4');
                            const imgData = canvas.toDataURL('image/png', 1.0);
                            const pdfWidth = pdf.internal.pageSize.getWidth();
                            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                            
                            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
                            pdf.save(`КП_${proposal.equipment.name}_${new Date().toLocaleDateString('ru-RU')}.pdf`);
                          } catch (error) {
                            console.error('Error generating PDF:', error);
                            alert('Ошибка при генерации PDF');
                          }
                        }}
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                      >
                        <Download className="w-5 h-5" />
                        Скачать КП #{index + 1}
                      </button>
                    </motion.div>
                  );
                })}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-16 border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Коммерческие предложения
                    </h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                      Выберите технику и нажмите "Добавить в КП". Каждое КП будет отображаться здесь отдельо
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1 a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Можно создать до 6 КП</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden PDF components for generation - always full size */}
        {proposals.map((proposal, index) => {
          const { finalPrice } = calculateProposalPrice(proposal);
          return (
            <div key={index} className="fixed left-[-9999px] top-0">
              <PDFProposal
                ref={(el) => (hiddenProposalRefs.current[index] = el)}
                selectedItem={proposal.equipment}
                categoryIcon={proposal.categoryIcon}
                clientCompany={clientCompany}
                clientName={clientName}
                days={days}
                quantity={proposal.quantity}
                finalPrice={finalPrice}
                validUntil={validUntil}
                additionalEquipment={additionalEquipment}
                deliveryTerms={deliveryTerms}
                warranty={warranty}
                deliveryTime={deliveryTime}
                paymentTerms={paymentTerms}
                managerName={selectedManager?.name}
                managerPhone={selectedManager?.phone}
                isPriceWithVAT={proposal.isPriceWithVAT}
                customPrice={proposal.customPrice}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}