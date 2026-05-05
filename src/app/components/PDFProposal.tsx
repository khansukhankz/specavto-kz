import { forwardRef } from 'react';
import logo from '/assets/logo.svg';
import truckImage from '/assets/truck-placeholder.svg';
import backgroundImage from '/assets/background.svg';

interface Equipment {
  id: number;
  name: string;
  pricePerDay: number;
  icon?: string;
  photoUrl?: string;
  photoUrls?: string[]; // Array of up to 3 photo URLs
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
    // Новые поля - Основные параметры
    loadCapacity?: string;
    centerOfGravity?: string;
    loadingType?: string;
    manufacturerCountry?: string;
    // Новые поля - Двигатель
    engineType?: string;
    engineManufacturer?: string;
    engineModel?: string;
    engineCountry?: string;
    engineDisplacement?: string;
    engineCylinders?: string;
    emissionStandard?: string;
    // Новые поля - Габариты
    overallWidth?: string;
    // Новые поля - Эксплуатационные параметры
    turningRadius?: string;
    maxGradient?: string;
    liftingSpeedWithLoad?: string;
    liftingSpeedWithoutLoad?: string;
    loweringSpeedWithLoad?: string;
    loweringSpeedWithoutLoad?: string;
    drivingSpeedWithLoad?: string;
    drivingSpeedWithoutLoad?: string;
    // Новые поля - Колеса
    frontTireSize?: string;
    rearTireSize?: string;
    clearance?: string;
    // Новые поля - Вес
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
  };
}

interface PDFProposalProps {
  selectedItem: Equipment | null;
  categoryIcon: string;
  clientCompany: string;
  clientName: string;
  days: number;
  quantity: number;
  finalPrice: number;
  validUntil: string;
  additionalEquipment: string;
  deliveryTerms: string;
  warranty: string;
  deliveryTime: string;
  paymentTerms: string;
  isFullWidth?: boolean; // New prop for desktop full-width display
  managerName?: string;
  managerPhone?: string;
  isPriceWithVAT?: boolean; // Flag to indicate if the displayed price includes VAT
  customPrice?: number; // Custom price entered by user (if any)
}

export const PDFProposal = forwardRef<HTMLDivElement, PDFProposalProps>(
  ({ selectedItem, categoryIcon, clientCompany, clientName, days, quantity, finalPrice, validUntil, additionalEquipment, deliveryTerms, warranty, deliveryTime, paymentTerms, isFullWidth = false, managerName, managerPhone, isPriceWithVAT, customPrice }, ref) => {
    // Early return if no selectedItem
    if (!selectedItem) {
      return null;
    }

    return (
      <div
        ref={ref}
        style={{
          width: isFullWidth ? '100%' : '210mm',
          minHeight: '297mm',
          maxHeight: '297mm',
          padding: '5mm',
          backgroundColor: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          fontSize: '9px',
          color: '#000000',
          lineHeight: '1.1',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Background watermark */}
        <div
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            height: 'auto',
            opacity: 0.15,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <img
            src={backgroundImage}
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Content wrapper with higher z-index */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '4px',
              paddingBottom: '3px',
              borderBottom: '2px solid #d1d5db',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src={logo} 
                alt="ТОО Спец Авто Казахстан" 
                style={{ 
                  height: '50px', 
                  width: 'auto',
                  objectFit: 'contain' 
                }} 
              />
            </div>

            {/* Title and Contacts */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px', color: '#1d4ed8' }}>
                КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ №
              </div>
              <div style={{ fontSize: '9px', marginBottom: '4px', color: '#374151' }}>
                ТОО «Спец Авто Казахстан», для {clientCompany || 'Клиента'}
              </div>
              <div style={{ fontSize: '9px', color: '#4b5563', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '2px' }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FE8A02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Казахстан, Алматы, ул. Брусиловского, 5-Я</span>
                </div>
                <div style={{ marginBottom: '2px' }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FE8A02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>{managerPhone || '+7 702 274 6797'}</span>
                </div>
                <div style={{ marginBottom: '2px' }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FE8A02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>specavtokazakhstan@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div style={{ marginBottom: '6px', fontSize: '10px', lineHeight: '1.3', color: '#374151' }}>
            <p style={{ margin: '0 0 3px 0', color: '#374151' }}>
              <strong style={{ color: '#FE8A02', fontSize: '11px' }}>ТОО Спец Авто Казахстан</strong> — ведущий поставщик спецтехники в Казахстане, раотающий с 2015 года и предоставляющий широкий спектр
              строительной и дорожной техники от мировых производитеей.
            </p>
            <p style={{ margin: '0' }}>Официальный партнер ведущих мировых производителей спецтехники. В течение многих лет накапливаем знания и опыт в области продажи техники, организации сервисного обслуживания и ремонта, обеспечении запасными частями от ведущих производителей. Сегодня в компании работает команда из более чем 50 высококвалифицированных специалистов.</p>
          </div>

          {/* Equipment Section */}
          <div style={{ marginBottom: '4px', marginTop: '2px' }}>
            {/* Title */}
            <h2
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '2px',
                color: '#1d4ed8',
              }}
            >
              {selectedItem.name}
            </h2>
            <div style={{ fontSize: '9px', color: '#4b5563', marginBottom: '6px' }}>Продажа спецтехники</div>

            {/* Three Photos */}
            <div style={{
              display: 'flex',
              gap: '6px',
              justifyContent: 'space-between',
              marginBottom: '6px'
            }}>
              {selectedItem.photoUrls && selectedItem.photoUrls.length > 0 ? (
                selectedItem.photoUrls.slice(0, 3).map((photoUrl, index) => (
                  <div
                    key={index}
                    style={{
                      flex: '1',
                      height: '120px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    <img
                      src={photoUrl}
                      alt={`${selectedItem.name} - фото ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '4px'
                      }}
                    />
                  </div>
                ))
              ) : (
                // Fallback - three placeholder photos
                <>
                  <div style={{
                    flex: '1',
                    height: '120px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#f9fafb'
                  }}>
                    <img
                      src={selectedItem.photoUrl || truckImage}
                      alt={selectedItem.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '4px'
                      }}
                    />
                  </div>
                  <div style={{
                    flex: '1',
                    height: '120px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#f9fafb'
                  }}>
                    <img
                      src={selectedItem.photoUrl || truckImage}
                      alt={selectedItem.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '4px'
                      }}
                    />
                  </div>
                  <div style={{
                    flex: '1',
                    height: '120px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#f9fafb'
                  }}>
                    <img
                      src={selectedItem.photoUrl || truckImage}
                      alt={selectedItem.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '4px'
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Technical Specifications */}
            <div>

                {/* Technical Specifications - Start here */}
                <h3
                  style={{
                    fontSize: '9px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    color: '#1f2937',
                  }}
                >
                  Технические характеристики:
                </h3>

                {/* Двигатель - внутри левого блока */}
                {(selectedItem.specs.engineType || selectedItem.specs.engineManufacturer || selectedItem.specs.engineModel || selectedItem.specs.engineCountry || selectedItem.specs.enginePower || selectedItem.specs.engineDisplacement || selectedItem.specs.engineCylinders || selectedItem.specs.emissionStandard) && (
                  <>
                    <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '3px', marginTop: '0px', color: '#1d4ed8' }}>
                      Двигатель
                    </h4>
                    <div style={{ fontSize: '9px', marginBottom: '2px' }}>
                      {selectedItem.specs.engineType && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ color: '#374151' }}>Тип двигателя:</span>
                          <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.engineType}</span>
                        </div>
                      )}
                      {selectedItem.specs.engineManufacturer && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ color: '#374151' }}>Производитель двигателя:</span>
                          <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.engineManufacturer}</span>
                        </div>
                      )}
                      {selectedItem.specs.engineModel && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ color: '#374151' }}>Модель двигателя:</span>
                          <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.engineModel}</span>
                        </div>
                      )}
                      {selectedItem.specs.engineCountry && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ color: '#374151' }}>Страна производства двигателя:</span>
                          <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.engineCountry}</span>
                        </div>
                      )}
                      {selectedItem.specs.enginePower && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ color: '#374151' }}>Мощность двигателя:</span>
                          <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.enginePower}</span>
                        </div>
                      )}
                      {selectedItem.specs.engineDisplacement && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ color: '#374151' }}>Объем двигателя:</span>
                          <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.engineDisplacement}</span>
                        </div>
                      )}
                      {selectedItem.specs.engineCylinders && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ color: '#374151' }}>Количетво цилиндров:</span>
                          <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.engineCylinders}</span>
                        </div>
                      )}
                      {selectedItem.specs.emissionStandard && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ color: '#374151' }}>Экологический стандарт:</span>
                          <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.emissionStandard}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
            </div>
          </div>

          {/* Technical Specifications Table - Continue */}
          <div style={{ marginBottom: '4px' }}>
            
            {/* Основные параметры */}
            {(selectedItem.specs.loadCapacity || selectedItem.specs.centerOfGravity || selectedItem.specs.loadingType || selectedItem.specs.manufacturerCountry) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Основные параметры
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  <div>
                    {selectedItem.specs.loadCapacity && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Грузоподъемность:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loadCapacity}</span>
                      </div>
                    )}
                    {selectedItem.specs.centerOfGravity && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Центр тяжести:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.centerOfGravity}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    {selectedItem.specs.loadingType && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Тип погрузки:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loadingType}</span>
                      </div>
                    )}
                    {selectedItem.specs.manufacturerCountry && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Страна производителя:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.manufacturerCountry}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}



            {/* Основная информация (если новых полей нет) */}
            <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
              Общая информация
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px' }}>
              {/* Left Column */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Производитель:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.brand || 'N/A'}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Модель:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.name}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Год выпуска:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.year || 'N/A'}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Мощность двигателя:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.enginePower || selectedItem.specs.power}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Грузоподъемность/Параметры:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.capacity}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Масса технии:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.weight}</span>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Тип топива:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.fuelType || 'Дизель'}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Коробка передач:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.transmission || 'N/A'}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Тип кабины:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cabinType || 'Закрытая'}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Предоставление:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.operator || 'С оператором'}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ color: '#374151' }}>Количество единиц:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{quantity} шт</span>
                </div>
              </div>
            </div>

            {/* Габариты */}
            {selectedItem.specs.overallWidth && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Габариты
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#374151' }}>Габаритная ширина:</span>
                    <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.overallWidth}</span>
                  </div>
                </div>
              </>
            )}

            {/* Эксплуатационные параметры */}
            {(selectedItem.specs.turningRadius || selectedItem.specs.maxGradient || selectedItem.specs.liftingSpeedWithLoad || selectedItem.specs.liftingSpeedWithoutLoad || selectedItem.specs.loweringSpeedWithLoad || selectedItem.specs.loweringSpeedWithoutLoad || selectedItem.specs.drivingSpeedWithLoad || selectedItem.specs.drivingSpeedWithoutLoad) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Эксплуатационные параметры
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  <div>
                    {selectedItem.specs.turningRadius && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Внешний радиус аворота:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.turningRadius}</span>
                      </div>
                    )}
                    {selectedItem.specs.maxGradient && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Максимальный преодолеваемый уклон:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.maxGradient}</span>
                      </div>
                    )}
                    {selectedItem.specs.liftingSpeedWithLoad && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Скорость подъема (с грузом):</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.liftingSpeedWithLoad}</span>
                      </div>
                    )}
                    {selectedItem.specs.liftingSpeedWithoutLoad && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Скорость подъема (без груз):</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.liftingSpeedWithoutLoad}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    {selectedItem.specs.loweringSpeedWithLoad && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Скорость опускания (с грузом):</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loweringSpeedWithLoad}</span>
                      </div>
                    )}
                    {selectedItem.specs.loweringSpeedWithoutLoad && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Скорость опускания (без груза):</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loweringSpeedWithoutLoad}</span>
                      </div>
                    )}
                    {selectedItem.specs.drivingSpeedWithLoad && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Скорость движения (с грузм):</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.drivingSpeedWithLoad}</span>
                      </div>
                    )}
                    {selectedItem.specs.drivingSpeedWithoutLoad && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Скорость движения (без груза):</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.drivingSpeedWithoutLoad}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Клеса */}
            {(selectedItem.specs.frontTireSize || selectedItem.specs.rearTireSize || selectedItem.specs.clearance) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Колеса
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  <div>
                    {selectedItem.specs.frontTireSize && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Размр пеедних шин:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.frontTireSize}</span>
                      </div>
                    )}
                    {selectedItem.specs.rearTireSize && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Размер задних шин:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.rearTireSize}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    {selectedItem.specs.clearance && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#374151' }}>Клиренс:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.clearance}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Вес */}
            {selectedItem.specs.totalMass && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Вес
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#374151' }}>Полная масса:</span>
                    <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.totalMass}</span>
                  </div>
                </div>
              </>
            )}

            {/* Характеристики кранов */}
            {(selectedItem.specs.technology || selectedItem.specs.liftingCapacity || selectedItem.specs.boomLength || selectedItem.specs.boomPlusJibLength || selectedItem.specs.controlType || selectedItem.specs.boomLiftingSpeed || selectedItem.specs.outriggersCount || selectedItem.specs.bridgeTechnology || selectedItem.specs.safetySystem || selectedItem.specs.balancingValves || selectedItem.specs.sensors || selectedItem.specs.hoses || selectedItem.specs.dimensions || selectedItem.specs.ownWeight || selectedItem.specs.engineModel2 || selectedItem.specs.enginePower2 || selectedItem.specs.equipment) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Специальные характеристики
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  {selectedItem.specs.technology && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Технология:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.technology}</span>
                    </div>
                  )}
                  {selectedItem.specs.liftingCapacity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Грузоподъёмность:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.liftingCapacity}</span>
                    </div>
                  )}
                  {selectedItem.specs.boomLength && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Полностью выпущенная стрела:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.boomLength}</span>
                    </div>
                  )}
                  {selectedItem.specs.boomPlusJibLength && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Полностью выпущ. стрела+гусек:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.boomPlusJibLength}</span>
                    </div>
                  )}
                  {selectedItem.specs.controlType && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Управление:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.controlType}</span>
                    </div>
                  )}
                  {selectedItem.specs.boomLiftingSpeed && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Скорость поднятия стрелы:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.boomLiftingSpeed}</span>
                    </div>
                  )}
                  {selectedItem.specs.outriggersCount && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Количество аутригеров:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.outriggersCount}</span>
                    </div>
                  )}
                  {selectedItem.specs.bridgeTechnology && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Мост:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.bridgeTechnology}</span>
                    </div>
                  )}
                  {selectedItem.specs.safetySystem && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Система безопасности:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.safetySystem}</span>
                    </div>
                  )}
                  {selectedItem.specs.balancingValves && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Клапаны балансирующие:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.balancingValves}</span>
                    </div>
                  )}
                  {selectedItem.specs.sensors && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Датчики:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.sensors}</span>
                    </div>
                  )}
                  {selectedItem.specs.hoses && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Шланги:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.hoses}</span>
                    </div>
                  )}
                  {selectedItem.specs.dimensions && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Габариты:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.dimensions}</span>
                    </div>
                  )}
                  {selectedItem.specs.ownWeight && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Собственный вес в движении:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.ownWeight}</span>
                    </div>
                  )}
                  {selectedItem.specs.engineModel2 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Модель двигателя:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.engineModel2}</span>
                    </div>
                  )}
                  {selectedItem.specs.enginePower2 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Мощность двигателя:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.enginePower2}</span>
                    </div>
                  )}
                  {selectedItem.specs.equipment && (
                    <div style={{ padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ color: '#374151', marginBottom: '2px' }}>Комплектация:</div>
                      <div style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.equipment}</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Характеристики самосвалов/грузовиков */}
            {(selectedItem.specs.wheelFormula || selectedItem.specs.averageSpeed || selectedItem.specs.bodyDimensions || selectedItem.specs.bodyBottomThickness || selectedItem.specs.bodySideThickness || selectedItem.specs.gearbox || selectedItem.specs.rearAxle || selectedItem.specs.frontAxle || selectedItem.specs.tires || selectedItem.specs.fuelTank || selectedItem.specs.suspension) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Характеристики транспортного средства
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  {selectedItem.specs.wheelFormula && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Колесная формула:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.wheelFormula}</span>
                    </div>
                  )}
                  {selectedItem.specs.averageSpeed && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Средняя скорость:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.averageSpeed}</span>
                    </div>
                  )}
                  {selectedItem.specs.bodyDimensions && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Кузов (ДхШхВ):</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.bodyDimensions}</span>
                    </div>
                  )}
                  {selectedItem.specs.bodyBottomThickness && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Толщина днища кузова:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.bodyBottomThickness}</span>
                    </div>
                  )}
                  {selectedItem.specs.bodySideThickness && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Толщина боковины кузова:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.bodySideThickness}</span>
                    </div>
                  )}
                  {selectedItem.specs.gearbox && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>КПП:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.gearbox}</span>
                    </div>
                  )}
                  {selectedItem.specs.rearAxle && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Задний мост:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.rearAxle}</span>
                    </div>
                  )}
                  {selectedItem.specs.frontAxle && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Передняя ось:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.frontAxle}</span>
                    </div>
                  )}
                  {selectedItem.specs.tires && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Шины:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.tires}</span>
                    </div>
                  )}
                  {selectedItem.specs.fuelTank && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Топливный бак:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.fuelTank}</span>
                    </div>
                  )}
                  {selectedItem.specs.suspension && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Подвеска:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.suspension}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Характеристики миксеров */}
            {(selectedItem.specs.exportVersion || selectedItem.specs.tankVolume || selectedItem.specs.fuelFilter || selectedItem.specs.brakeSystem || selectedItem.specs.mixingPlant || selectedItem.specs.reducer || selectedItem.specs.hydraulicPump || selectedItem.specs.hydraulicMotor) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Специальные характеристики миксера
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  {selectedItem.specs.exportVersion && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.exportVersion}</span>
                    </div>
                  )}
                  {selectedItem.specs.tankVolume && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Объем цистерны:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.tankVolume}</span>
                    </div>
                  )}
                  {selectedItem.specs.fuelFilter && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Топливный фильтр:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.fuelFilter}</span>
                    </div>
                  )}
                  {selectedItem.specs.brakeSystem && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Тормозная система:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.brakeSystem}</span>
                    </div>
                  )}
                  {selectedItem.specs.mixingPlant && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Смесительная установка:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.mixingPlant}</span>
                    </div>
                  )}
                  {selectedItem.specs.reducer && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Редуктор:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.reducer}</span>
                    </div>
                  )}
                  {selectedItem.specs.hydraulicPump && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Гидравлический насос:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.hydraulicPump}</span>
                    </div>
                  )}
                  {selectedItem.specs.hydraulicMotor && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Гидравлический двигатель:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.hydraulicMotor}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Характеристики манипуляторов */}
            {(selectedItem.specs.chassisLoadCapacity || selectedItem.specs.steeringSystem || selectedItem.specs.drivingAxle || selectedItem.specs.bodySize || selectedItem.specs.sideWallThickness || selectedItem.specs.bottomSheetThickness || selectedItem.specs.kmuCapacity || selectedItem.specs.boomLength2 || selectedItem.specs.cradle || selectedItem.specs.doubleFrame) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Характеристики манипулятора
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  {selectedItem.specs.chassisLoadCapacity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Грузоподъемность шасси:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.chassisLoadCapacity}</span>
                    </div>
                  )}
                  {selectedItem.specs.steeringSystem && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Рулевая машина:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.steeringSystem}</span>
                    </div>
                  )}
                  {selectedItem.specs.drivingAxle && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Ведущий мост:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.drivingAxle}</span>
                    </div>
                  )}
                  {selectedItem.specs.bodySize && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Размеры кузова (ДхШхВ):</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.bodySize}</span>
                    </div>
                  )}
                  {selectedItem.specs.sideWallThickness && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Толщина боковых стенок:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.sideWallThickness}</span>
                    </div>
                  )}
                  {selectedItem.specs.bottomSheetThickness && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Толщина нижнего листа:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.bottomSheetThickness}</span>
                    </div>
                  )}
                  {selectedItem.specs.kmuCapacity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Грузоподъемность КМУ:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.kmuCapacity}</span>
                    </div>
                  )}
                  {selectedItem.specs.boomLength2 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Длина стрелы:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.boomLength2}</span>
                    </div>
                  )}
                  {selectedItem.specs.cradle && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Люлька:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cradle}</span>
                    </div>
                  )}
                  {selectedItem.specs.doubleFrame && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Двухслойная рама:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.doubleFrame}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Характеристики полуприцепов */}
            {(selectedItem.specs.trailerVolume || selectedItem.specs.trailerDimensions || selectedItem.specs.trailerInnerDimensions || selectedItem.specs.trailerLoadCapacity || selectedItem.specs.trailerBottomPlate || selectedItem.specs.trailerSidePlate || selectedItem.specs.trailerMainBeam || selectedItem.specs.trailerAxle || selectedItem.specs.trailerTires || selectedItem.specs.trailerHydraulicCylinder || selectedItem.specs.trailerColor) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Характеристики полуприцепа
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  {selectedItem.specs.trailerVolume && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Объем:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerVolume}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerDimensions && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Размеры:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerDimensions}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerInnerDimensions && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Внутренние размеры:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerInnerDimensions}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerLoadCapacity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Грузоподъемность:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerLoadCapacity}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerBottomPlate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Нижняя пластина:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerBottomPlate}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerSidePlate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Боковая пластина:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerSidePlate}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerMainBeam && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Основной лонжерон:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerMainBeam}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerAxle && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Ось:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerAxle}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerTires && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Шины:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerTires}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerHydraulicCylinder && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Гидравлический цилиндр:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerHydraulicCylinder}</span>
                    </div>
                  )}
                  {selectedItem.specs.trailerColor && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Цвет:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.trailerColor}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Характеристики трала */}
            {(selectedItem.specs.lowbedExportVersion || selectedItem.specs.lowbedLoadCapacity || selectedItem.specs.lowbedAxleCount || selectedItem.specs.lowbedAxleDistance || selectedItem.specs.lowbedPlatformHeight || selectedItem.specs.lowbedSuspension || selectedItem.specs.lowbedTires || selectedItem.specs.lowbedRamps || selectedItem.specs.lowbedWidth || selectedItem.specs.lowbedWorkingLength || selectedItem.specs.lowbedTotalLength || selectedItem.specs.lowbedTotalHeight || selectedItem.specs.lowbedTotalWidth || selectedItem.specs.lowbedMass || selectedItem.specs.lowbedEquipment) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Характеристики трала
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  {selectedItem.specs.lowbedExportVersion && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedExportVersion}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedLoadCapacity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Грузоподъемность:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedLoadCapacity}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedAxleCount && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Кол-во осей:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedAxleCount}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedAxleDistance && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Расстояние между осями:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedAxleDistance}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedPlatformHeight && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Высота платформы:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedPlatformHeight}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedSuspension && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Подвеска:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedSuspension}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedTires && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Шины:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedTires}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedRamps && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Трапы:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedRamps}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedWidth && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Ширина трала:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedWidth}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedWorkingLength && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Рабочая длина:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedWorkingLength}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedTotalLength && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Общая длина:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedTotalLength}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedTotalHeight && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Общая высота:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedTotalHeight}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedTotalWidth && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Ширина:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedTotalWidth}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedMass && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Масса:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedMass}</span>
                    </div>
                  )}
                  {selectedItem.specs.lowbedEquipment && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Комплектация:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.lowbedEquipment}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Характеристики цементовоза */}
            {(selectedItem.specs.cementExportVersion || selectedItem.specs.cementDimensions || selectedItem.specs.cementHeadThickness || selectedItem.specs.cementTankThickness || selectedItem.specs.cementAxle || selectedItem.specs.cementAirCompressor || selectedItem.specs.cementDieselEngine || selectedItem.specs.cementTires || selectedItem.specs.cementCapacity) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Характеристики цементовоза
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  {selectedItem.specs.cementExportVersion && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cementExportVersion}</span>
                    </div>
                  )}
                  {selectedItem.specs.cementDimensions && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Размеры:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cementDimensions}</span>
                    </div>
                  )}
                  {selectedItem.specs.cementHeadThickness && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Толщина головки:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cementHeadThickness}</span>
                    </div>
                  )}
                  {selectedItem.specs.cementTankThickness && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Толщина бака:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cementTankThickness}</span>
                    </div>
                  )}
                  {selectedItem.specs.cementAxle && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Ось:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cementAxle}</span>
                    </div>
                  )}
                  {selectedItem.specs.cementAirCompressor && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Воздушный компрессор:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cementAirCompressor}</span>
                    </div>
                  )}
                  {selectedItem.specs.cementDieselEngine && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Дизельный двигатель:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cementDieselEngine}</span>
                    </div>
                  )}
                  {selectedItem.specs.cementTires && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Шины:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cementTires}</span>
                    </div>
                  )}
                  {selectedItem.specs.cementCapacity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Емкость:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.cementCapacity}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Характеристики фронтального погрузчика */}
            {(selectedItem.specs.loaderTechnology || selectedItem.specs.loaderLoadCapacity || selectedItem.specs.loaderOperatingMass || selectedItem.specs.loaderDimensions || selectedItem.specs.loaderBucketVolume || selectedItem.specs.loaderEngine || selectedItem.specs.loaderControl || selectedItem.specs.loaderDumpHeight || selectedItem.specs.loaderBucketForce || selectedItem.specs.loaderBrakeSystem || selectedItem.specs.loaderDumpDistance || selectedItem.specs.loaderHydraulicCapacity || selectedItem.specs.loaderGears || selectedItem.specs.loaderTires || selectedItem.specs.loaderEquipment) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Характеристики фронтального погрузчика
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  {selectedItem.specs.loaderTechnology && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderTechnology}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderLoadCapacity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Грузоподъемность:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderLoadCapacity}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderOperatingMass && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Эксплуатационная масса:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderOperatingMass}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderDimensions && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Габариты (Д×Ш×В):</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderDimensions}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderBucketVolume && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Объем ковша:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderBucketVolume}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderEngine && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Двигатель:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderEngine}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderControl && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Управление:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderControl}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderDumpHeight && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Высота выгрузки:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderDumpHeight}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderBucketForce && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Макс.усилие ковша:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderBucketForce}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderBrakeSystem && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Тормозная система:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderBrakeSystem}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderDumpDistance && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Дальность выгрузки:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderDumpDistance}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderHydraulicCapacity && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Заправочная емкость гидравлики:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderHydraulicCapacity}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderGears && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Количество передач:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderGears}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderTires && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Шины:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderTires}</span>
                    </div>
                  )}
                  {selectedItem.specs.loaderEquipment && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#374151' }}>Комплектация:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.loaderEquipment}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Дополнительные характеристики */}
            {(selectedItem.specs.custom1 || selectedItem.specs.custom2 || selectedItem.specs.custom3 || selectedItem.specs.custom4 || selectedItem.specs.custom5) && (
              <>
                <h4 style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', marginTop: '5px', color: '#1d4ed8' }}>
                  Дополнительные характеристики
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', fontSize: '9px', marginBottom: '2px' }}>
                  {selectedItem.specs.custom1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.custom1}</span>
                    </div>
                  )}
                  {selectedItem.specs.custom2 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.custom2}</span>
                    </div>
                  )}
                  {selectedItem.specs.custom3 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.custom3}</span>
                    </div>
                  )}
                  {selectedItem.specs.custom4 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.custom4}</span>
                    </div>
                  )}
                  {selectedItem.specs.custom5 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{selectedItem.specs.custom5}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Price */}
          <div style={{ marginBottom: '8px', paddingTop: '6px', marginTop: '6px', borderTop: '2px solid #d1d5db' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1d4ed8' }}>
              Цена: {finalPrice.toLocaleString()} ₸
            </div>
            <div style={{ fontSize: '9px', marginTop: '3px', color: '#4b5563' }}>
              {customPrice !== undefined
                ? (isPriceWithVAT
                    ? `Цена с НДС 12%`
                    : `Цена указана без НДС`
                  )
                : `(${selectedItem?.pricePerDay.toLocaleString()} ₸ × ${quantity} шт + НДС 12%)`
              }
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '6px', paddingTop: '5px', borderTop: '1px solid #d1d5db' }}>
            <div style={{ fontSize: '9px', marginBottom: '2px', color: '#374151', lineHeight: '1.3' }}>
              <strong>Ваш персональный менеджер {managerName || 'Мурат Абдулла'}:</strong>
              <br />
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FE8A02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>{managerPhone || '+7 702 274 6797'}</span>
              <span style={{ margin: '0 4px' }}>|</span>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FE8A02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>specavtokazakhstan@gmail.com</span>
            </div>
            <div style={{ fontSize: '7px', lineHeight: '1.3', color: '#6b7280' }}>Настоящее коммерческое предложение не является офертой и не обязывает ТОО Спец Авто Казахстан к заключению договора на указанных условиях. Окончательные условия определяются отдельно заключаемым догвором.</div>
          </div>
        </div>
      </div>
    );
  }
);

PDFProposal.displayName = 'PDFProposal';