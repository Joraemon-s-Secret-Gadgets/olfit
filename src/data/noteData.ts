/**
 * @file noteData.ts
 * @description 향수의 주요 원료(Notes)에 대한 상세 설명을 담은 데이터베이스입니다.
 * UX 최적화를 위해 각 카테고리별 가장 상징적인 8개의 원료(8:8:8)로 구성합니다.
 */

export interface ScentNote {
  name: string;
  enName: string;
  category: "Top" | "Middle" | "Base";
  description: string;
  origin: string;
}

export const scentNotes: ScentNote[] = [
  // --- TOP NOTES (8): 싱그럽고 즉각적인 첫인상 ---
  {
    name: "베르가못",
    enName: "Bergamot",
    category: "Top",
    description: "우아하고 화사한 감귤 향. 조말론과 르라보 등 수많은 명작의 도입부를 여는 가장 세련된 시트러스입니다.",
    origin: "이탈리아산 감귤류 과일"
  },
  {
    name: "네롤리",
    enName: "Neroli",
    category: "Top",
    description: "오렌지 꽃의 싱그러운 향. 순수한 햇살 아래 하얀 꽃잎처럼 깨끗하고 로맨틱한 분위기를 만듭니다.",
    origin: "비터 오렌지 나무의 꽃"
  },
  {
    name: "알데하이드",
    enName: "Aldehyde",
    category: "Top",
    description: "깨끗한 비누와 갓 세탁한 셔츠의 향. 샤넬 N°5와 바이레도 블랑쉬를 상징하는 현대적인 청결함의 대명사입니다.",
    origin: "합성 향료 원료"
  },
  {
    name: "페어",
    enName: "Pear",
    category: "Top",
    description: "달콤하고 시원한 서양배의 과즙 향. 조말론의 시그니처로 투명하고 신선한 가을의 정취를 전합니다.",
    origin: "신선한 서양배 추출물"
  },
  {
    name: "핑크 페퍼",
    enName: "Pink Pepper",
    category: "Top",
    description: "톡 쏘는 발랄함과 섬세한 스파이스 향. 향기의 시작에 생동감 넘치는 현대적인 리듬을 부여합니다.",
    origin: "브라질산 페퍼 트리 열매"
  },
  {
    name: "주니퍼 베리",
    enName: "Juniper Berry",
    category: "Top",
    description: "진(Gin) 술 특유의 시원하고 알싸한 향. 바이레도 집시 워터처럼 차가운 새벽 공기 같은 청량함을 자아냅니다.",
    origin: "주니퍼 나무의 열매"
  },
  {
    name: "민트",
    enName: "Mint",
    category: "Top",
    description: "얼음처럼 차갑고 상쾌한 허브 향. 러쉬(Lush) 더티처럼 정체된 감각을 깨워주는 강렬한 에너지를 선사합니다.",
    origin: "박하 식물의 잎"
  },
  {
    name: "카다멈",
    enName: "Cardamom",
    category: "Top",
    description: "따뜻하고 스파이시한 이국적인 풍미. 르라보 상탈33의 도입부에서 느껴지는 야성적인 세련미의 원천입니다.",
    origin: "생강과 식물의 씨앗"
  },

  // --- MIDDLE NOTES (8): 향수의 성격과 심장 ---
  {
    name: "로즈",
    enName: "Rose",
    category: "Middle",
    description: "화려하고 우아한 꽃의 여왕. 클래식한 로맨틱함부터 현대적인 시크함까지 지닌 절대적인 원료입니다.",
    origin: "터키 및 불가리아산 장미"
  },
  {
    name: "자스민",
    enName: "Jasmine",
    category: "Middle",
    description: "관능적이고 풍성한 화이트 플로럴 향. 딥디크 도손처럼 밤의 공기 속에 핀 달콤하고 깊은 꽃향기입니다.",
    origin: "이집트 및 인도산 자스민 꽃"
  },
  {
    name: "무화과",
    enName: "Fig",
    category: "Middle",
    description: "크리미한 과육과 쌉싸름한 잎사귀 향. 딥디크 필로시코스처럼 지적인 여름의 정취를 담습니다.",
    origin: "무화과 열매와 잎"
  },
  {
    name: "아이리스",
    enName: "Iris",
    category: "Middle",
    description: "파우더리하고 귀족적인 보랏빛 향. 샤넬과 디올의 고급스러운 잔향을 책임지는 매우 귀하고 우아한 원료입니다.",
    origin: "붓꽃의 말린 뿌리"
  },
  {
    name: "화이트 티",
    enName: "White Tea",
    category: "Middle",
    description: "차분하고 정갈한 찻잎의 향. 불가리와 시로의 향수에서 마음을 가라앉히는 명상적인 평온함을 줍니다.",
    origin: "어린 차나무 잎"
  },
  {
    name: "편백",
    enName: "Hinoki",
    category: "Middle",
    description: "비 온 뒤 숲길의 신선한 나무 향. 이솝(Aesop) 특유의 깊은 안식과 치유의 무드를 만듭니다.",
    origin: "일본산 편백나무 추출물"
  },
  {
    name: "라벤더",
    enName: "Lavender",
    category: "Middle",
    description: "마음을 진정시키는 허브의 대명사. 깨끗하고 중성적인 세련미와 편안함을 동시에 선사합니다.",
    origin: "라벤더 꽃과 잎"
  },
  {
    name: "블랙커런트",
    enName: "Blackcurrant",
    category: "Middle",
    description: "새콤달콤한 베리와 톡 쏘는 그린 노트. 딥디크 롬브로단로처럼 매혹적인 생명력을 표현합니다.",
    origin: "블랙커런트 열매와 싹"
  },

  // --- BASE NOTES (8): 피부에 남는 깊은 여운 ---
  {
    name: "샌달우드",
    enName: "Sandalwood",
    category: "Base",
    description: "포근하고 크리미한 우유빛 나무 향. 르라보 상탈33처럼 차분하고 명상적인 고급스러움을 줍니다.",
    origin: "인도산 백단향 나무"
  },
  {
    name: "머스크",
    enName: "Musk",
    category: "Base",
    description: "살결처럼 부드럽고 깨끗한 잔향. 모든 향기를 포근하게 감싸 안으며 신비로운 안정감을 선사합니다.",
    origin: "식물성 및 합성 향료 원료"
  },
  {
    name: "앰버",
    enName: "Amber",
    category: "Base",
    description: "따뜻하고 달콤한 수지의 향. 피부 위에 오래 머무는 포근한 온기와 성숙한 관능미를 표현합니다.",
    origin: "나무 수지(Resin)에서 유래"
  },
  {
    name: "베티버",
    enName: "Vetiver",
    category: "Base",
    description: "비 온 뒤의 흙 내음과 쌉싸름한 연기 향. 중성적이고 이성적인 매력을 가진 묵직한 우디 향의 핵심입니다.",
    origin: "열대 지방 풀의 뿌리"
  },
  {
    name: "바닐라",
    enName: "Vanilla",
    category: "Base",
    description: "달콤하고 부드러운 위로의 향. 톰포드처럼 고급스럽고 미식가(Gourmand)적인 매력을 완성합니다.",
    origin: "마다가스카르산 바닐라 빈"
  },
  {
    name: "가죽",
    enName: "Leather",
    category: "Base",
    description: "야성적이고 센슈얼한 가죽 특유의 향. 바이레도와 톰포드에서 느껴지는 대담한 카리스마입니다.",
    origin: "자작나무 타르 등 복합 향료"
  },
  {
    name: "우드",
    enName: "Oud",
    category: "Base",
    description: "침향나무에서 얻는 가장 진귀한 향료. 묵직하고 어두운 나무 향과 신비로운 관능미의 조화입니다.",
    origin: "동남아시아의 침향나무"
  },
  {
    name: "인센스",
    enName: "Incense",
    category: "Base",
    description: "신성한 사원에서 피어오르는 연기 향. 바이레도와 이솝에서 느껴지는 정적인 신비로움을 담았습니다.",
    origin: "유향 및 나무 수지"
  }
];
