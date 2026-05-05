// Updated: 2026-04-23 - Added trailers category, moved trailers from trucks
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as kv from "./kv_store.tsx";
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const BUCKET_NAME = 'make-0be467f4-equipment-photos';

app.use("/*", cors({
  origin: (origin) => origin,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: false,
}));

const EQUIPMENT_DATA = {
  categories: [
    { id: 'cranes', name: 'Краны', icon: 'building2' },
    { id: 'excavators', name: 'Экскаваторы', icon: 'pickaxe' },
    { id: 'concrete', name: 'Бетонное оборудование', icon: 'hard-hat' },
    { id: 'trucks', name: 'Грузовая техника', icon: 'truck' },
    { id: 'trailers', name: 'Прицепы', icon: 'container' },
    { id: 'bulldozers', name: 'Бульдозеры', icon: 'construction' },
    { id: 'loaders', name: 'Погрузчики', icon: 'package' },
  ],
  brands: {
    cranes: [
      { id: 'liebherr', name: 'Liebherr' },
      { id: 'grove', name: 'Grove' },
      { id: 'terex', name: 'Terex' },
    ],
    excavators: [
      { id: 'caterpillar', name: 'Caterpillar' },
      { id: 'komatsu', name: 'Komatsu' },
      { id: 'hitachi', name: 'Hitachi' },
    ],
    concrete: [
      { id: 'putzmeister', name: 'Putzmeister' },
      { id: 'schwing', name: 'Schwing' },
      { id: 'cifa', name: 'CIFA' },
      { id: 'shacman', name: 'SHACMAN' },
    ],
    trucks: [
      { id: 'kamaz', name: 'КАМАЗ' },
      { id: 'man', name: 'MAN' },
      { id: 'volvo', name: 'Volvo' },
      { id: 'shacman', name: 'SHACMAN' },
    ],
    trailers: [
      { id: 'shacman', name: 'SHACMAN' },
    ],
    bulldozers: [
      { id: 'komatsu', name: 'Komatsu' },
      { id: 'caterpillar', name: 'Caterpillar' },
      { id: 'shantui', name: 'Shantui' },
    ],
    loaders: [
      { id: 'volvo', name: 'Volvo' },
      { id: 'caterpillar', name: 'Caterpillar' },
      { id: 'jcb', name: 'JCB' },
    ],
  },
  models: {
    'cranes-liebherr': [
      {
        id: 'crane-liebherr-1',
        categoryId: 'cranes',
        brandId: 'liebherr',
        name: 'LTM 1050-3.1',
        pricePerDay: 185000000,
        specs: {
          brand: 'Liebherr',
          capacity: '50 тонн',
          maxHeight: '40 метров',
          weight: '36 тонн',
          year: '2022',
          fuelType: 'Дизель',
          transmission: 'Автоматическая',
          cabinType: 'Закрытая с климат-контролем',
          operator: 'С оператором',
          technology: 'LIEBHERR (Германия)',
          liftingCapacity: '25 000 кг',
          boomLength: '39,5 метр',
          boomPlusJibLength: '48,5 метр',
          controlType: 'Джойстиковое управление',
          boomLiftingSpeed: '75сек',
          outriggersCount: '5 шт',
          bridgeTechnology: 'MERRITOR (технология США)',
          safetySystem: 'PAT (Германия)',
          balancingValves: 'Италия',
          sensors: 'HIRSCHMANN (Германия)',
          hoses: 'Manuli, Sunflex',
          dimensions: '12870 * 2550 * 3470мм',
          ownWeight: '31 000 кг',
          engineModel2: 'MC07H.32-50',
          enginePower2: '221 кВт',
          equipment: 'кондиционер, печка в кабине водителя, климат-контроль в кабине оператора, ЗИП ящик в заводской комплектации',
        },
      },
      {
        id: 'crane-liebherr-2',
        categoryId: 'cranes',
        brandId: 'liebherr',
        name: 'LTM 1100-5.2',
        pricePerDay: 295000000,
        specs: {
          brand: 'Liebherr',
          capacity: '100 тонн',
          maxHeight: '52 метра',
          weight: '48 тонн',
          enginePower: '449 л.с.',
          engineDisplacement: '12.8 л',
          engineCylinders: '8',
          emissionStandard: 'Euro 6',
          year: '2023',
          fuelType: 'Дизель',
          transmission: 'Автоматическая',
          cabinType: 'Закрытая с климат-контролем',
          operator: 'С оператором',
        },
      },
    ],
    'cranes-grove': [
      {
        id: 'crane-grove-1',
        categoryId: 'cranes',
        brandId: 'grove',
        name: 'GMK5250L',
        pricePerDay: 485000000,
        specs: {
          brand: 'Grove',
          capacity: '250 тонн',
          maxHeight: '100 метров',
          weight: '72 тонны',
          enginePower: '544 л.с.',
          engineDisplacement: '15.6 л',
          engineCylinders: '8',
          emissionStandard: 'Euro 5',
          year: '2022',
          fuelType: 'Дизель',
          transmission: 'Автоматическая',
          cabinType: 'Закрытая с климат-контролем',
          operator: 'С оператором',
        },
      },
    ],
    'excavators-caterpillar': [
      {
        id: 'excavator-cat-1',
        categoryId: 'excavators',
        brandId: 'caterpillar',
        name: 'CAT 320',
        pricePerDay: 125000000,
        specs: {
          brand: 'Caterpillar',
          capacity: 'Ковш 1.2 м³',
          maxHeight: '6.5 метров',
          weight: '22 тонны',
          enginePower: '150 л.с.',
          year: '2021',
          fuelType: 'Дизель',
          transmission: 'Гидравлическая',
          cabinType: 'Закрытая с климат-контролем',
          operator: 'С оператором',
        },
      },
      {
        id: 'excavator-cat-2',
        categoryId: 'excavators',
        brandId: 'caterpillar',
        name: 'CAT 336',
        pricePerDay: 165000000,
        specs: {
          brand: 'Caterpillar',
          capacity: 'Ковш 1.9 м³',
          maxHeight: '7.8 метров',
          weight: '36 тонн',
          enginePower: '268 л.с.',
          year: '2022',
          fuelType: 'Дизель',
          transmission: 'Гидравлическая',
          cabinType: 'Закрытая с климат-контролем',
          operator: 'С оператором',
        },
      },
    ],
    'excavators-komatsu': [
      {
        id: 'excavator-komatsu-1',
        categoryId: 'excavators',
        brandId: 'komatsu',
        name: 'PC210LC-11',
        pricePerDay: 135000000,
        specs: {
          brand: 'Komatsu',
          capacity: 'Ковш 1.0 м³',
          maxHeight: '6.2 метра',
          weight: '21 тонна',
          enginePower: '148 л.с.',
          year: '2022',
          fuelType: 'Дизель',
          transmission: 'Гидравлическая',
          cabinType: 'Закрытая с климат-контролем',
          operator: 'С оператором',
        },
      },
    ],
    'concrete-putzmeister': [
      {
        id: 'concrete-putz-1',
        categoryId: 'concrete',
        brandId: 'putzmeister',
        name: 'BSF 47.16H',
        pricePerDay: 245000000,
        specs: {
          brand: 'Putzmeister',
          capacity: 'Подача 160 м³/ч',
          maxHeight: '47 метров',
          weight: '28 тонн',
          enginePower: '320 л.с.',
          year: '2023',
          fuelType: 'Дизель',
          transmission: 'Автоматическая',
          cabinType: 'Закрытая',
          operator: 'С оператором',
        },
      },
    ],
    'concrete-shacman': [
      {
        id: 'concrete-shacman-1',
        categoryId: 'concrete',
        brandId: 'shacman',
        name: 'X3000 6x4 Миксер 10м³',
        pricePerDay: 75000000,
        specs: {
          brand: 'SHACMAN',
          capacity: '10 куб.м.',
          weight: '15 тонн',
          year: '2024',
          fuelType: 'Дизель',
          cabinType: 'TX (со спальником)',
          operator: 'С водителем',
          exportVersion: 'ЭКСПОРТНЫЙ ВАРИАНТ',
          tankVolume: '10 куб.м.',
          wheelFormula: '6х4',
          engineModel2: 'MAN MC11.40-50',
          enginePower2: '400 л.с.',
          fuelFilter: 'Parker первого уровня',
          averageSpeed: '80 км/час',
          gearbox: 'механика HW19712C, 12-ти ступенчетая',
          rearAxle: 'MCX16ZG саморегулирующийся рычаг, двойной задний мост (барабан), передаточное число 5,451',
          frontAxle: 'VGD95',
          tires: 'МЕТАЛЛОКОРД 12.00-R20',
          brakeSystem: 'WABKO ABS (4S/4M)',
          fuelTank: '400 л',
          dimensions: '8715 х 2496 х 3850 мм',
          mixingPlant: 'Редуктор: TOP P68',
          reducer: 'TOP P68',
          hydraulicPump: 'ARK PV089',
          hydraulicMotor: 'ARK MF089',
        },
      },
    ],
    'trucks-kamaz': [
      {
        id: 'truck-kamaz-1',
        categoryId: 'trucks',
        brandId: 'kamaz',
        name: '6520-6012-43',
        pricePerDay: 42000000,
        specs: {
          brand: 'КАМАЗ',
          capacity: 'Кузов 20 м³',
          maxHeight: '20 тонн',
          weight: '18 тонн',
          enginePower: '380 л.с.',
          year: '2022',
          fuelType: 'Дизель',
          transmission: 'Механическая',
          cabinType: 'Закрытая',
          operator: 'С водителем',
        },
      },
    ],
    'trucks-shacman': [
      {
        id: 'truck-shacman-1',
        categoryId: 'trucks',
        brandId: 'shacman',
        name: 'X3000 6x4 Седельный тягач',
        pricePerDay: 58000000,
        specs: {
          brand: 'SHACMAN',
          capacity: 'Тягач 40 тонн',
          maxHeight: '49 тонн',
          weight: '9 тонн',
          enginePower: '430 л.с.',
          year: '2023',
          fuelType: 'Дизель',
          transmission: 'Механическая 12-ступ',
          cabinType: 'Закрытая sleeper',
          operator: 'С водителем',
        },
      },
      {
        id: 'truck-shacman-2',
        categoryId: 'trucks',
        brandId: 'shacman',
        name: 'F3000 6x4 Самосвал',
        pricePerDay: 52000000,
        specs: {
          brand: 'SHACMAN',
          capacity: 'Кузов 25 м³',
          weight: '12 тонн',
          year: '2023',
          fuelType: 'Дизель',
          cabinType: 'Закрытая',
          operator: 'С водителем',
          technology: 'Технология MAN (Германия) – X3000',
          liftingCapacity: '25 000 кг',
          wheelFormula: '6х4',
          engineModel2: 'CUMMINS (ISM) EURO V',
          enginePower2: '385 л.с.',
          averageSpeed: '80 км/час',
          bodyDimensions: '5800 х 2300 х 1500 мм',
          bodyBottomThickness: '8 мм',
          bodySideThickness: '4 мм',
          gearbox: 'механика 12JSD180T, 12-ти ступка',
          rearAxle: 'MAN 16 тн',
          frontAxle: 'MAN 7.5 тн',
          tires: 'МЕТАЛЛОКОРД 12.00-R20',
          fuelTank: '400 л',
          suspension: '4 усиленные стремянки на рессорах',
          dimensions: '8329 х 2490 х 3450 мм',
          equipment: 'кондиционер, печка, ЗИП ящик в заводской комплектации',
        },
      },
      {
        id: 'truck-shacman-3',
        categoryId: 'trucks',
        brandId: 'shacman',
        name: 'L3000 4x2 Бортовой',
        pricePerDay: 38000000,
        specs: {
          brand: 'SHACMAN',
          capacity: 'Кузов 7 м',
          maxHeight: '10 тонн',
          weight: '6 тонн',
          enginePower: '240 л.с.',
          year: '2022',
          fuelType: 'Дизель',
          transmission: 'Механическая 8-ступ',
          cabinType: 'Закрытая',
          operator: 'С водителем',
        },
      },
      {
        id: 'truck-shacman-4',
        categoryId: 'trucks',
        brandId: 'shacman',
        name: 'H3000 8x4 Самосвал',
        pricePerDay: 65000000,
        specs: {
          brand: 'SHACMAN',
          capacity: 'Кузов 30 м³',
          maxHeight: '30 тонн',
          weight: '15 тонн',
          enginePower: '430 л.с.',
          year: '2023',
          fuelType: 'Дизель',
          transmission: 'Механическая 12-ступ',
          cabinType: 'Закрытая',
          operator: 'С водителем',
        },
      },
      {
        id: 'truck-shacman-5',
        categoryId: 'trucks',
        brandId: 'shacman',
        name: 'X3000 6x4 Манипулятор',
        pricePerDay: 75000000,
        specs: {
          brand: 'SHACMAN',
          capacity: 'КМУ 12 тонн',
          weight: '20 тонн',
          year: '2024',
          fuelType: 'Дизель',
          cabinType: 'Закрытая',
          operator: 'С водителем',
          technology: 'Технология MAN (Германия) – X3000',
          chassisLoadCapacity: '20 000 кг',
          steeringSystem: 'BOSCH',
          drivingAxle: 'MCJ13BGS',
          bodySize: '8000 х 2300 х 600 мм',
          sideWallThickness: '1.5 мм',
          bottomSheetThickness: '5 мм',
          kmuCapacity: '12 тонн',
          boomLength2: '12.5 м',
          cradle: 'Люлька в комплекте',
          doubleFrame: 'Двухслойная рама, ABS (4S/4M)',
        },
      },
    ],
    'trailers-shacman': [
      {
        id: 'trailer-shacman-1',
        categoryId: 'trailers',
        brandId: 'shacman',
        name: 'Полуприцеп 4 оси',
        pricePerDay: 45000000,
        specs: {
          brand: 'SHACMAN',
          capacity: '41,6 Куб',
          weight: '40-60T',
          year: '2024',
          fuelType: 'Без двигателя',
          cabinType: 'Полуприцеп',
          operator: 'С тягачом',
          trailerVolume: '41,6 Куб',
          trailerDimensions: '10500×2720×3500(mm)',
          trailerInnerDimensions: '9200*2530*1800MM, 41,6 m³',
          trailerLoadCapacity: '40-60T',
          trailerBottomPlate: '8 MM',
          trailerSidePlate: '6 MM',
          trailerMainBeam: '14mm, 8mm, 16mm',
          trailerAxle: 'FUWA 4*13T, 4 Ось пневматическая подвеска, Передний Ось с функцией подъема',
          trailerTires: '385 65 R22.5 16+1 PCS, С запасной шиной',
          trailerHydraulicCylinder: 'Один 200# гидравлический цилиндр',
          trailerColor: 'Серый',
        },
      },
      {
        id: 'trailer-shacman-2',
        categoryId: 'trailers',
        brandId: 'shacman',
        name: 'Трал 4 оси',
        pricePerDay: 55000000,
        specs: {
          brand: 'SHACMAN',
          capacity: '70 тонн',
          weight: '12 000 кг',
          year: '2024',
          fuelType: 'Без двигателя',
          cabinType: 'Трал',
          operator: 'С тягачом',
          lowbedExportVersion: 'ЭКСПОРТНЫЙ ВАРИАНТ',
          lowbedLoadCapacity: '70 000 кг',
          lowbedAxleCount: '4',
          lowbedAxleDistance: '1,31 м',
          lowbedPlatformHeight: '90 см',
          lowbedSuspension: 'Рессорная подвеска',
          lowbedTires: '235/75 R17.50 (Металлокорд)',
          lowbedRamps: 'механические',
          lowbedWidth: '2,5 м + уширители (+0,5 м)',
          lowbedWorkingLength: '12 000 мм',
          lowbedTotalLength: '16 000 мм',
          lowbedTotalHeight: '3 200 мм',
          lowbedTotalWidth: '2 500 мм',
          lowbedMass: '12 000 кг',
          lowbedEquipment: 'ЗИП ящик в заводской комплектации',
        },
      },
      {
        id: 'trailer-shacman-3',
        categoryId: 'trailers',
        brandId: 'shacman',
        name: 'Цементовоз 45 куб',
        pricePerDay: 65000000,
        specs: {
          brand: 'SHACMAN',
          capacity: '45 куб.',
          weight: '15 000 кг',
          year: '2024',
          fuelType: 'Дизель',
          cabinType: 'Полуприцеп',
          operator: 'С тягачом',
          cementExportVersion: 'ЭКСПОРТНЫЙ ВАРИАНТ',
          cementDimensions: '10300*2500*3900',
          cementHeadThickness: '4MM Толщина',
          cementTankThickness: '4 MM Толщина',
          cementAxle: 'FUWA 4*13T, Тяжелая механическая подвеска',
          cementAirCompressor: 'BOHAI 12m³',
          cementDieselEngine: 'Weichai4102',
          cementTires: '12R22.5 16 PCS, С запасной шиной',
          cementCapacity: '45 куб.',
        },
      },
    ],
    'bulldozers-komatsu': [
      {
        id: 'bulldozer-komatsu-1',
        categoryId: 'bulldozers',
        brandId: 'komatsu',
        name: 'D65EX-17',
        pricePerDay: 155000000,
        specs: {
          brand: 'Komatsu',
          capacity: 'Отвал 4.5 м',
          maxHeight: '15 тонн',
          weight: '25 тонн',
          enginePower: '240 л.с.',
          year: '2021',
          fuelType: 'Дизель',
          transmission: 'Гидравлическая',
          cabinType: 'Закрытая с кондиционером',
          operator: 'С оператором',
        },
      },
    ],
    'loaders-volvo': [
      {
        id: 'loader-volvo-1',
        categoryId: 'loaders',
        brandId: 'volvo',
        name: 'L90H',
        pricePerDay: 95000000,
        specs: {
          brand: 'Volvo',
          capacity: 'Ковш 2.5 м³',
          maxHeight: '5 тонн',
          weight: '12 тонн',
          enginePower: '120 л.с.',
          year: '2022',
          fuelType: 'Дизель',
          transmission: 'Гидромеханическая',
          cabinType: 'Закрытая с климат-контролем',
          operator: 'С оператором',
        },
      },
      {
        id: 'loader-volvo-2',
        categoryId: 'loaders',
        brandId: 'volvo',
        name: 'Фронтальный погрузчик 3.5т',
        pricePerDay: 85000000,
        specs: {
          brand: 'Volvo',
          capacity: 'Ковш 2.1 м³',
          weight: '10 400 кг',
          year: '2024',
          fuelType: 'Дизель',
          cabinType: 'Закрытая с климат-контролем',
          operator: 'С оператором',
          loaderTechnology: 'Технология CATERPILLAR (USA)',
          loaderLoadCapacity: '3 500 кг',
          loaderOperatingMass: '10 400 кг (± 200кг)',
          loaderDimensions: '7450x2482x2482 мм',
          loaderBucketVolume: '2.1 куб.м.',
          loaderEngine: 'SC7H130G2B Shanghai',
          loaderControl: 'ДЖОЙСТИКОВОЕ',
          loaderDumpHeight: '2900 мм',
          loaderBucketForce: '115 кН',
          loaderBrakeSystem: 'дисковая',
          loaderDumpDistance: '1030 мм',
          loaderHydraulicCapacity: '155 л',
          loaderGears: '4 вперед, 2 назад',
          loaderTires: '17,5–25 (12-слоев)',
          loaderEquipment: 'Система холодного запуска, кондиционер, печка, ЗИП ящик в заводской комплектации',
        },
      },
    ],
  },
};

async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: false });
    }
    return true;
  } catch (error) {
    return false;
  }
}

async function initializeEquipment() {
  try {
    await initializeStorage();
    const isInitialized = await kv.get('equipment:initialized');
    if (isInitialized) return true;

    for (const category of EQUIPMENT_DATA.categories) {
      const categoryBrands = EQUIPMENT_DATA.brands[category.id];
      if (!categoryBrands) continue;
      for (const brand of categoryBrands) {
        const key = `${category.id}-${brand.id}`;
        const models = EQUIPMENT_DATA.models[key];
        if (!models || !Array.isArray(models)) continue;
        for (const model of models) {
          await kv.set(`equipment:${model.id}`, model);
        }
      }
    }

    await kv.set('equipment:initialized', true);
    await kv.set(`manager:manager-default`, {
      id: 'manager-default',
      name: 'Мурат Абдулла',
      phone: '+7 702 274 6797'
    });
    return true;
  } catch (error) {
    return false;
  }
}

app.get("/make-server-0be467f4/health", async (c) => {
  try {
    const isInitialized = await kv.get('equipment:initialized');
    const allEquipment = await kv.getByPrefix('equipment:');
    const equipmentCount = allEquipment.filter(item => item.id && item.name);
    return c.json({
      status: "ok",
      initialized: !!isInitialized,
      equipmentCount: equipmentCount.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      status: "error",
      error: String(error),
      timestamp: new Date().toISOString()
    }, 500);
  }
});

app.get("/make-server-0be467f4/equipment", async (c) => {
  try {
    await initializeEquipment();
    const allEquipment = await kv.getByPrefix('equipment:');
    if (allEquipment && allEquipment.length > 0) {
      const equipmentList = allEquipment
        .filter(item => item.id && item.name)
        .map(item => ({
          ...item,
          pricePerDay: item.pricePerDay ?? 0
        }));
      return c.json({ success: true, data: equipmentList });
    }
    return c.json({ success: true, data: [] });
  } catch (error) {
    return c.json({ success: true, data: [] });
  }
});

app.get("/make-server-0be467f4/categories", async (c) => {
  try {
    return c.json({ success: true, data: EQUIPMENT_DATA.categories });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-0be467f4/brands/:categoryId", async (c) => {
  try {
    const categoryId = c.req.param('categoryId');
    const defaultBrands = EQUIPMENT_DATA.brands[categoryId] || [];
    const allEquipment = await kv.getByPrefix('equipment:');
    const categoryEquipment = allEquipment.filter(item => item.id && item.name && item.categoryId === categoryId);
    const brandIds = new Set(defaultBrands.map(b => b.id));
    const customBrands: Array<{id: string, name: string}> = [];
    categoryEquipment.forEach(item => {
      if (item.brandId && !brandIds.has(item.brandId)) {
        brandIds.add(item.brandId);
        const brandName = item.brandId.charAt(0).toUpperCase() + item.brandId.slice(1);
        customBrands.push({ id: item.brandId, name: brandName });
      }
    });
    const allBrands = [...defaultBrands, ...customBrands];
    return c.json({ success: true, data: allBrands });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-0be467f4/models/:categoryId/:brandId", async (c) => {
  try {
    const categoryId = c.req.param('categoryId');
    const brandId = c.req.param('brandId');
    await initializeEquipment();
    const allEquipment = await kv.getByPrefix('equipment:');
    const filteredModels = allEquipment
      .filter(item => item.id && item.name && item.categoryId === categoryId && item.brandId === brandId)
      .map(item => ({
        ...item,
        pricePerDay: item.pricePerDay ?? 0
      }));
    return c.json({ success: true, data: filteredModels });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-0be467f4/equipment/reinit", async (c) => {
  try {
    const allEquipment = await kv.getByPrefix('equipment:');
    const deletePromises = [];
    for (const item of allEquipment) {
      if (item.id) {
        deletePromises.push(kv.del(`equipment:${item.id}`));
      }
    }
    await Promise.all(deletePromises);
    await kv.del('equipment:initialized');
    await initializeEquipment();
    const newEquipment = await kv.getByPrefix('equipment:');
    const equipmentList = newEquipment.filter(item => item.id && item.name);
    return c.json({ success: true, message: 'Equipment reinitialized successfully', count: equipmentList.length });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put("/make-server-0be467f4/equipment/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`equipment:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'Equipment not found' }, 404);
    }
    const updated = {
      ...existing,
      pricePerDay: body.pricePerDay ?? existing.pricePerDay ?? 0,
      specs: body.specs || existing.specs,
      photoUrl: existing.photoUrl || body.photoUrl,
      photoUrls: existing.photoUrls || body.photoUrls,
    };
    await kv.set(`equipment:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete("/make-server-0be467f4/equipment/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const existing = await kv.get(`equipment:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'Equipment not found' }, 404);
    }

    // Delete photos from storage if they exist
    if (existing.photoUrls && existing.photoUrls.length > 0) {
      try {
        const filePaths = existing.photoUrls
          .filter((url: string) => url.includes(BUCKET_NAME))
          .map((url: string) => {
            const parts = url.split(`${BUCKET_NAME}/`);
            return parts[parts.length - 1].split('?')[0];
          });

        if (filePaths.length > 0) {
          await supabase.storage.from(BUCKET_NAME).remove(filePaths);
          console.log(`Server: Deleted ${filePaths.length} photos for equipment ${id}`);
        }
      } catch (photoError) {
        console.error('Server: Error deleting photos:', photoError);
        // Continue with equipment deletion even if photo deletion fails
      }
    }

    // Delete equipment from database
    await kv.del(`equipment:${id}`);
    console.log(`Server: Deleted equipment ${id}`);

    return c.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-0be467f4/equipment", async (c) => {
  try {
    const body = await c.req.json();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const id = `equipment-${body.categoryId}-${timestamp}-${randomStr}`;
    const newEquipment = {
      id,
      categoryId: body.categoryId,
      brandId: body.brandId,
      name: body.name,
      pricePerDay: body.pricePerDay ?? 0,
      specs: body.specs || {},
    };
    await kv.set(`equipment:${id}`, newEquipment);
    return c.json({ success: true, data: newEquipment });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-0be467f4/equipment/:id/photos", async (c) => {
  try {
    const id = c.req.param('id');
    const equipment = await kv.get(`equipment:${id}`);
    if (!equipment) {
      return c.json({ success: false, error: 'Equipment not found' }, 404);
    }
    let formData;
    try {
      formData = await c.req.formData();
    } catch (formError) {
      return c.json({ success: false, error: 'Invalid form data' }, 400);
    }
    const photo1 = formData.get('photo1');
    const photo2 = formData.get('photo2');
    const photo3 = formData.get('photo3');
    const files = [photo1, photo2, photo3].filter(f => f && f instanceof File) as File[];
    if (files.length === 0) {
      return c.json({ success: false, error: 'No files provided' }, 400);
    }
    if (equipment.photoUrls && Array.isArray(equipment.photoUrls)) {
      const oldPaths = equipment.photoUrls.map((url: string) => url.split('/').pop()?.split('?')[0]).filter(Boolean) as string[];
      if (oldPaths.length > 0) {
        await supabase.storage.from(BUCKET_NAME).remove(oldPaths);
      }
    }
    const photoUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const timestamp = Date.now();
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${id}-${timestamp}-${i + 1}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filename, buffer, { contentType: file.type, upsert: true });
      if (uploadError) continue;
      const { data: urlData } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(filename, 315360000);
      if (urlData) {
        photoUrls.push(urlData.signedUrl);
      }
    }
    if (photoUrls.length === 0) {
      return c.json({ success: false, error: 'Failed to upload photos' }, 500);
    }
    const updated = { ...equipment, photoUrls };
    await kv.set(`equipment:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-0be467f4/equipment/:id/photo", async (c) => {
  try {
    const id = c.req.param('id');
    const equipment = await kv.get(`equipment:${id}`);
    if (!equipment) {
      return c.json({ success: false, error: 'Equipment not found' }, 404);
    }
    const formData = await c.req.formData();
    const file = formData.get('photo');
    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${id}-${timestamp}.${ext}`;
    if (equipment.photoUrl) {
      const oldPath = equipment.photoUrl.split('/').pop()?.split('?')[0];
      if (oldPath) {
        await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
      }
    }
    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filename, buffer, { contentType: file.type, upsert: true });
    if (uploadError) {
      return c.json({ success: false, error: uploadError.message }, 500);
    }
    const { data: urlData } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(filename, 315360000);
    if (!urlData) {
      return c.json({ success: false, error: 'Failed to create signed URL' }, 500);
    }
    const updated = { ...equipment, photoUrl: urlData.signedUrl };
    await kv.set(`equipment:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-0be467f4/managers", async (c) => {
  try {
    const managers = await kv.getByPrefix('manager:');
    const managerList = managers.filter(m => m.id && m.name);
    return c.json({ success: true, data: managerList });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-0be467f4/managers", async (c) => {
  try {
    const body = await c.req.json();
    const { name, phone } = body;
    if (!name || !phone) {
      return c.json({ success: false, error: 'Name and phone are required' }, 400);
    }
    const id = `manager-${Date.now()}`;
    const manager = { id, name, phone };
    await kv.set(`manager:${id}`, manager);
    return c.json({ success: true, data: manager });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put("/make-server-0be467f4/managers/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`manager:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'Manager not found' }, 404);
    }
    const updated = { ...existing, name: body.name ?? existing.name, phone: body.phone ?? existing.phone };
    await kv.set(`manager:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete("/make-server-0be467f4/managers/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const existing = await kv.get(`manager:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'Manager not found' }, 404);
    }
    await kv.del(`manager:${id}`);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
