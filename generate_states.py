import os

states_data = {
    'adamawa': {
        'full_name': 'Adamawa State',
        'content': '''Adamawa State has partnered with the SPIN project to drive large-scale agricultural improvements. The state has chosen Model 1, which involves a collaborative partnership with the Federal Government on an existing River Basin Development Authority (RBDA) scheme. To fulfill this objective, Adamawa has selected the Gerio Irrigation Scheme for rehabilitation.

The Gerio Irrigation Scheme is located at coordinates Lat: 10.03165° and Long: 11.9549°. The state is currently working with designated focal officers to integrate the project with federal frameworks and ensure smooth execution at the local level.'''
    },
    'bauchi': {
        'full_name': 'Bauchi State',
        'content': '''Bauchi State is participating in the SPIN project to enhance its federal-state agricultural partnerships. Operating under Model 1, the state is collaborating directly with the Federal Government on a designated RBDA scheme to improve water distribution and crop yields. The Galala Irrigation scheme is the chosen site for this Model 1 partnership.

The Galala Irrigation scheme covers an area located between Latitude 11° 12' 54" N to 11° 14' 42" N and Longitude 9° 40' 30" E to 9° 44' 6" E. State focal officers are actively managing the on-ground coordination to align with the Federal Ministry's broader development goals.'''
    },
    'benue': {
        'full_name': 'Benue State',
        'content': '''Benue State, known as the food basket of the nation, is utilizing the SPIN project to upgrade its irrigation networks. By opting for Model 1, Benue is engaging in a strategic partnership with the Federal Government to co-manage an RBDA scheme. The Katsina-Ala Irrigation scheme has been prioritized for this critical infrastructure upgrade.

The Katsina-Ala Irrigation scheme is geographically marked at Lat: 7˚8'44''N and Long: 9˚16'47''E. Implementation is being guided by local focal officers who interface between the state agricultural bodies and federal regulators.'''
    },
    'borno': {
        'full_name': 'Borno State',
        'content': '''Borno State has joined the SPIN project to revitalize its agricultural sector and promote sustainable farming practices. The state has selected Model 1, choosing to rehabilitate an existing Federal RBDA scheme in partnership with the national government. The Alau Irrigation scheme serves as the cornerstone of this initiative in the state.

The Alau Irrigation scheme is situated at coordinates Lat: 11.724423° and Long: 13.285392°. The project is being supported by state focal officers who are committed to executing the project milestones and restoring the region's agricultural capacity.'''
    },
    'ebonyi': {
        'full_name': 'Ebonyi State',
        'content': '''Ebonyi State is expanding its rice and general crop production capabilities through its participation in the SPIN project. The state is operating under Model 1, partnering with the Federal Government to enhance a federal RBDA scheme located within its borders. The Ndieze Irrigation scheme has been selected to receive these vital developmental investments.

The Ndieze Irrigation scheme is located at Longitude 6° 26' 21'' N and Latitude 8° 18' 14" E. State-appointed focal officers are overseeing the alignment of local farming operations with the overarching federal management structure.'''
    },
    'ekiti': {
        'full_name': 'Ekiti State',
        'content': '''Ekiti State is leveraging the SPIN project to maximize the potential of its water resources for agriculture. Under Model 1, the state is collaborating with the Federal Government to rehabilitate an established RBDA scheme, ensuring shared responsibilities and robust funding. The Ogbese Irrigation scheme is the selected project for Ekiti State.

The Ogbese Irrigation scheme is found at coordinates Lat: 7.455833° and Long: 5.328334°. The project operations are being liaised by focal officers who ensure that the state's agricultural objectives are met through this federal partnership.'''
    },
    'enugu': {
        'full_name': 'Enugu State',
        'content': '''Enugu State is boosting its agricultural output by actively participating in the SPIN project. By adopting Model 1, the state is partnering directly with the Federal Government to manage and improve a federal RBDA scheme. The Ada Rice Irrigation scheme has been carefully selected to undergo rehabilitation under this program.

The Ada Rice Irrigation scheme is located at Lat: 6.727763° and Long: 7.015664°. State focal officers are currently coordinating the foundational phases of the project, working to integrate local farmers with the newly improved federal infrastructure.'''
    },
    'kogi': {
        'full_name': 'Kogi State',
        'content': '''Kogi State is participating in the SPIN project to enhance its irrigation systems and promote year-round agricultural productivity. Choosing Model 1, the state is working in tandem with the Federal Government to revitalize a targeted RBDA scheme. The Kampe-Omi Irrigation scheme is the designated site for this joint investment.

The Kampe-Omi Irrigation scheme is situated at Lat: 8° 34′ and Long: 6° 37'. The project is managed locally by focal officers who are dedicated to ensuring the state meets its co-financing and operational readiness requirements.'''
    },
    'kwara': {
        'full_name': 'Kwara State',
        'content': '''Kwara State has embraced the SPIN project as a pathway to significant agricultural growth and sustainability. Under Model 1, Kwara is collaborating with the Federal Government on an RBDA scheme, pooling resources for effective infrastructure rehabilitation. The Duku Lade Irrigation scheme has been chosen as the focal project in the state.

The Duku Lade Irrigation scheme is located at coordinates Lat: 8.7888390 and Long: 5.6288770. Coordination is handled by state focal officers who are actively engaged in facilitating the Federal-State partnership.'''
    },
    'nasarawa': {
        'full_name': 'Nasarawa State',
        'content': '''Nasarawa State is upgrading its farming capabilities by taking part in the SPIN project. The state is implementing Model 1, focusing on a synergistic partnership with the Federal Government to rehabilitate a federal RBDA scheme. The Doma Irrigation scheme has been selected as the priority site for these interventions.

The Doma Irrigation scheme is mapped at Latitude 8° 24'N and Longitude 8° 30'E. The state's assigned focal officers are directing the initial phases of the project, ensuring alignment with both local agricultural needs and federal standards.'''
    },
    'plateau': {
        'full_name': 'Plateau State',
        'content': '''Plateau State is utilizing the SPIN project to secure its water supply for extensive agricultural use. By opting for Model 1, Plateau is committing to a collaborative effort with the Federal Government to restore an existing RBDA scheme. The Longkat Irrigation scheme has been identified as the key project for the state.

The Longkat Irrigation scheme is positioned at coordinates Lat: 9.154167° and Long: 9.359722°. Implementation and stakeholder engagement are being led by the state's focal officers to ensure the successful rollout of the SPIN initiative.'''
    },
    'cross-river': {
        'full_name': 'Cross-River State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed">The Bansara Irrigation Scheme is located in Bansara Town, Ogoja Local Government Area of Cross River State, approximately 35 km south of Ogoja town and about 0.5 km south of Bansara along the Ogoja–Ikom–Mamfe highway corridor. The project area lies at coordinates 6°30'49.30"N and 8°38'8.80"E and covers an estimated gross command area of approximately 630 hectares with significant potential for future expansion.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The scheme derives its water from the Aya River, a perennial tributary of the Cross River Basin. The proposed irrigation development consists of a river intake structure that abstracts water into a strategically positioned Night Storage Reservoir (NSR) located at a higher elevation within the project area. The reservoir provides operational flexibility by storing water during pumping periods and releasing it on demand to the irrigation network. From the NSR, water will be distributed through a gravity-fed conveyance system to the command area, significantly reducing recurrent energy costs. 
              The State Project Coordinator is MRS. JUSTINA JOHN ULAFOR and can be reached via email: justinaulafor3@gmail.com </p>'''
    },
    'gombe': {
        'full_name': 'Gombe State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Balanga Dam and Irrigation Scheme is situated in Balanga Local Government Area of Gombe State, near Talasse and surrounding farming communities. The scheme is supplied by Balanga Dam, located at coordinates 9°54′22″N and 11°32′09″E, constructed across the Balanga River, a tributary of the Gongola River.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The dam was constructed between 1982 and 1984 and commissioned in 1985, with irrigation activities commencing in 1988. It was originally designed as a single-purpose irrigation facility with fisheries as a secondary function. The reservoir has a total storage capacity of 72.6 million cubic metres (MCM) and a live storage capacity of approximately 62.7 MCM, enabling irrigation of approximately 4,000 hectares through gravity-fed canals.</p>

        <p class="text-lg text-slate-600 leading-relaxed">The State Project Coordinator is DR. KABIR M. ALIYU and can be reached via email: mk4aliyu@gmail.com </p>'''
    },
    'jigawa': {
        'full_name': 'Jigawa State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Warwade dam and Irrigation Scheme is located in Warwade Community, in Dutse Local Government Area of Jigawa State, at approximately 11.749271°N and 9.21447°E. The scheme is designed to serve an irrigable command area of approximately 812 hectares.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The scheme detailed design identified approximately 700 hectares suitable for conventional gravity-fed open-channel irrigation due to favourable topographic gradients and soil characteristics. An additional 100 hectares was identified for mechanized irrigation using centre-pivot systems, enabling more efficient water application and improved crop water management.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The integration of gravity irrigation with pressurized centre-pivot systems represents a modern irrigation approach that enhances water use efficiency while maximizing agricultural productivity. 

The State Project Coordinator is ENGR. ALHASSAN ABBAS and can be reached via email: alhassandutse@yahoo.com </p>'''
    },
    'kaduna': {
        'full_name': 'Kaduna State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Kangimi dam and Irrigation Scheme is located in Kangimi Community, Igabi Local Government Area of Kaduna State, on the northern bank of the Kaduna River upstream of Kaduna metropolis. The scheme falls within a relatively flat to gently undulating savannah landscape characterized by slopes ranging between 0.75° and 1.2°, which are highly suitable for gravity irrigation development.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The scheme source of water is supplied by Kangimi Dam, constructed in 1974 across the Kangimi River approximately 3.2 km upstream of its confluence with the Kaduna River. The dam serves a dual purpose of supplementing domestic water supply to Kaduna metropolis and supporting agricultural irrigation, with water released through a multi-level outlet tower and conveyed downstream through the Kangimi River into the Kaduna River system, supporting a proposed irrigation area of 1,300 hectares.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The State Project Coordinator is Engr. HASHIMU J. USMAN and can be reached via email: engineerhashim50@gmail.com </p>'''
    },
    'kano': {
        'full_name': 'Kano State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Jakara-Wasai dam and Irrigation Scheme is located in Minjibir Local Government Area of Kano State, covering communities around the Wasai Dam and the Jakara-Wasai River system. The project area lies between latitudes 12.20°N and 12.35°N and longitudes 8.60°E and 8.75°E, with elevations ranging between 480 and 500 metres above sea level.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The scheme is designed to irrigate approximately 3,000 hectares and represents one of the largest irrigation developments proposed under the SPIN Project. Detailed bathymetric surveys indicate that Wasai Dam currently stores approximately 71.38 million cubic metres of water, compared with its original design capacity of 82 million cubic metres. The reservoir covers an area of approximately 15.31 square kilometres and reaches a maximum depth of 13.8 metres.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The State Project Coordinator is ENGR. NURADDEEN ISAH ABUBAKAR and can be reached via email: ahmannur2@gmail.com </p>'''
    },
    'katsina': {
        'full_name': 'Katsina State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Danja dam and Irrigation Scheme is located in Danja Town, Danja Local Government Area of Katsina State, within the Funtua Senatorial Zone. Danja LGA shares boundaries with Funtua, Bakori, Kafur, Kudan, and Giwa Local Government Areas and occupies approximately 504.7 square kilometres.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The scheme depends on the Danja Earth Dam, which has a storage capacity of approximately 95.41 million cubic metres, making it one of the largest reservoirs among the proposed SPIN irrigation schemes, and it is designed to support an irrigated area of about 1,217 hectares.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The State Project Coordinator is ENGR. SHAMSUDEEN SULEMAN and can be reached via email: sskafur@gmail.com </p>'''
    },
    'kebbi': {
        'full_name': 'Kebbi State',
        'content': '<!-- Content for this state will be added later -->'
    },
    'niger': {
        'full_name': 'Niger State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Rabba Irrigation Scheme is located in Rabba Community, Mokwa Local Government Area of Niger State, Nigeria. The scheme lies adjacent to the River Niger floodplain at approximately 9.203509°N and 5.040676°E, within an area historically known for intensive agricultural activities across the broader Nupe Kingdom region.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> Originally Unlike most irrigation schemes the scheme is distinguished by its direct dependence on the River Niger as its primary water source, rather than on a storage reservoir. Water abstraction is achieved through a lift-and-gravity irrigation system, whereby water is pumped directly from the river through intake and pumping facilities and conveyed into the irrigation distribution network. 
Under the SPIN Project, the scheme is planned to be modernised and includes Night Reservoirs that will enable it to irrigate approximately 1,500 hectares of farmland.</p>

        <p class="text-lg text-slate-600 leading-relaxed">The State Project Coordinator is MR. MANSUR ALIYU GORO and can be reached via email: mansurgoro@gmail.com </p>'''
    },
    'sokoto': {
        'full_name': 'Sokoto State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Kware dam and Irrigation Scheme is located in Kware Town, Kware Local Government Area of Sokoto State, approximately 20 km north of Sokoto metropolis. The scheme is centred around Kware Lake, a naturally occurring freshwater lake connected to the Rima River system.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> Originally developed in the 1950s, the scheme was designed to irrigate approximately 1,000 hectares. The reservoir has a storage capacity of approximately 5 million cubic metres, retained by an earth embankment measuring about 6 kilometres in length. Currently, about 450 hectares are operational, while an additional 800 hectares remain available for future expansion.</p>

        <p class="text-lg text-slate-600 leading-relaxed">The State Project Coordinator is DR. ADAMU ABDULLAHI and can be reached via email: adamgad83@gmail.com</p>'''
    },
    'taraba': {
        'full_name': 'Taraba State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Lau Irrigation Scheme is located in Lau Local Government Area of Taraba State, Nigeria, within a strategically important agricultural corridor approximately 45 km northeast of Jalingo, the state capital. The project site occupies the former Lau Tomato Factory farmland and lies between latitudes 9°12′N and 9°22′N and longitudes 11°14′E and 11°30′E. 
Hydrologically, the scheme is based on the Lau River system, which is closely linked to the River Benue Basin, the principal source of perennial irrigation water for the project. The irrigation design employs a gravity-fed surface irrigation system, in which water is abstracted from the river and conveyed to a Night Storage Reservoir before being distributed through a network of canals serving the command area. Under the SPIN Project, the scheme targets the development of approximately 2,000 hectares of irrigated farmland.</p>

        <p class="text-lg text-slate-600 leading-relaxed">The State Project Coordinator is ENGR. PHILIP L. BATARE and can be reached via email: philipbatare19@gmail.com</p>'''
    },
    'yobe': {
        'full_name': 'Yobe State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Nguru Irrigation Scheme is located in Nguru Town, Nguru Local Government Area of Yobe State, within the internationally significant Hadejia-Nguru Wetlands. The scheme lies at approximately 12.8792°N and 10.4510°E and benefits from water stored within Nguru Lake and the Marma Channel system.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The reservoir has a storage capacity of approximately 210 million cubic metres, while annual inflows range between 500 and 700 million cubic metres. After satisfying ecological requirements, evaporation losses, groundwater recharge, and biodiversity conservation needs, sufficient water remains available to support irrigation over approximately 1,000 hectares.</p>

        <p class="text-lg text-slate-600 leading-relaxed">The scheme's strategic significance lies in its ability to support agricultural development while preserving the ecological integrity of the Hadejia-Nguru Wetlands, one of West Africa's most important wetland ecosystems.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The State Project Coordinator is ALHAJI ABDULLAHI ABBA and can be reached via email: abdullahiabba448@gmail.com </p>'''
    },
    'zamfara': {
        'full_name': 'Zamfara State',
        'content': '''<p class="text-lg text-slate-600 leading-relaxed"> The Natu dam and Irrigation Scheme is located in Gamji Village, Bakura Local Government Area of Zamfara State, approximately 9 km from Bakura Town and 140 km from Gusau. The project lies within the coordinates 12°40'9.78"N and 5°53'28.43"E.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> Established between 1962 and 1965 under the leadership of Sir Ahmadu Bello, with support from the World Bank and the British Colonial Development Corporation, the scheme is among Nigeria’s oldest irrigation developments. It relies on Natu Lake, which is fed by the Bobo River and tributary inflows from Talata Mafara, and its original irrigation area of approximately 200 hectares is currently proposed to be expanded to 1,000 hectares.</p>

        <p class="text-lg text-slate-600 leading-relaxed"> The State Project Coordinator is ENGR. ILLYASU LABARAN and can be reached via email: ILiyasulabaran@gmail.com </p>'''
    }
}

base_html = '''﻿<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{full_name} | SPIN</title>

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Inter font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/png" href="../images/spin_logo.jpeg" />
  <link rel="shortcut icon" href="../images/spin_logo.jpeg" type="image/jpeg" />
  <link rel="stylesheet" href="../style.css" />
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-K6HTFD29WJ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-K6HTFD29WJ');
  </script>
</head>
<body class="antialiased font-sans text-gray-900 bg-white">

  <!-- Skip link -->
  <a href="#main" class="sr-only focus:not-sr-only absolute left-2 top-2 z-[999] rounded bg-white px-3 py-2 text-sm font-semibold shadow outline outline-2 outline-offset-2 outline-[#aaff33]">
    Skip to main content
  </a>

  <!-- Top Info Bar -->
  <div class="bg-white shadow-sm border-b border-gray-100">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-2.5 flex items-center justify-between gap-4 text-sm">
      <a href="/" class="flex items-center gap-3 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">
        <img src="../images/spin_logo.jpeg" alt="SPIN — Sustainable Power Initiative Nigeria" class="h-14 w-auto" />
        <span class="sr-only">Home</span>
      </a>
      <div class="flex items-center space-x-6 md:space-x-8 text-gray-700 text-xs sm:text-sm">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-custom-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <div class="hidden sm:block">
            <p class="text-xs text-gray-500">Call us</p>
            <p class="font-semibold text-black">+2348034432501</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-custom-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.893-3.893 7.893 3.893a2 2 0 011.107 1.776v7.351a2 2 0 01-2 2H4a2 2 0 01-2-2v-7.351a2 2 0 011.107-1.776zM4 8l8 5 8-5"/></svg>
          <div class="hidden sm:block">
            <p class="text-xs text-gray-500">Send mail</p>
            <p class="font-semibold text-black">info@spinproject.ng</p>
          </div>
        </div>
        <div class="hidden lg:flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-custom-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L12 22l-5.657-5.343A8 8 0 1117.657 16.657zM12 13a3 3 0 100-6 3 3 0 000 6z"/></svg>
          <div class="hidden sm:block">
            <p class="text-xs text-gray-500">Find us at</p>
            <p class="font-semibold text-black">Plot 1402, Abba Kyari Street, Off Adesoji <br> Aderemi Street, Apo-Abuja, FCT, Nigeria</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <header class="bg-custom-green sticky top-0 z-50 shadow">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 h-14 relative flex items-center justify-end xl:grid" style="grid-template-columns: 1fr auto 1fr;">
      <div class="hidden xl:block"></div>
      <nav aria-label="Primary" class="hidden xl:flex justify-center items-center gap-4 2xl:gap-6 text-[0.85rem] 2xl:text-[0.95rem] font-semibold relative whitespace-nowrap">
        <a href="/" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">Home</a>
        <a href="/about" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">About us</a>
        <a href="/mandate" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">Mandate</a>
        <a href="/advertisements" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">Advertisements</a>
        <a href="/news" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">News</a>
        <a href="/participating-states" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">Participating States</a>
        <a href="/gallery" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">Gallery</a>
        <a href="/project" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">Projects</a>
        <a href="/resources" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">Resources</a>
        <a href="/grievance" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">Grievance</a>
        <a href="/contact" class="text-white/90 hover:text-white border-b-2 border-transparent hover:border-white px-1.5">Contact</a>
      </nav>
      <div class="hidden xl:flex justify-end items-center">
        <div class="relative flex items-center">
          <input id="search-input" type="search" inputmode="search" aria-label="Search site" placeholder="Search..."
                 class="h-10 text-sm bg-white rounded-full text-gray-800 border border-gray-200 shadow-inner px-4 pr-10 transition-all duration-300 ease-in-out absolute right-0 search-collapsed" />
          <button id="search-toggle" class="relative z-10 p-2 text-white hover:text-white/90 rounded-full focus:outline-none focus:ring-2 focus:ring-[#aaff33]" aria-expanded="false" aria-controls="search-input" aria-label="Open search">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z"/>
            </svg>
          </button>
        </div>
      </div>
      <button id="mobile-menu-button" class="xl:hidden text-white hover:text-white/90 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m0 6H4"/>
        </svg>
      </button>
    </div>

    <div id="mobile-menu" class="xl:hidden hidden border-t border-white/20 bg-custom-green/95 backdrop-blur">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-3 space-y-1 text-white/95">
        <a href="/" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">Home</a>
        <a href="/about" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">About us</a>
        <a href="/mandate" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">Mandate</a>
        <a href="/advertisements" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">Advertisements</a>
        <a href="/news" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">News</a>
        <a href="/participating-states" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">Participating States</a>
        <a href="/gallery" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">Gallery</a>
        <a href="/project" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">Projects</a>
        <a href="/resources" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">Resources</a>
        <a href="/grievance" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">Grievance</a>
        <a href="/contact" class="block py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#aaff33]">Contact</a>
      </div>
    </div>
  </header>

  <section class="relative w-full h-64 md:h-80 flex items-center justify-center bg-cover bg-center" style="background-image: url('../images/solar2.jpg');">
    <div class="absolute inset-0 bg-gradient-to-r from-green-900/95 to-green-800/70 mix-blend-multiply transition-opacity duration-700"></div>
    <div class="relative z-10 text-center px-4 sm:px-6 transform translate-y-0 opacity-100 transition-all duration-1000 ease-out">
      <nav class="text-sm text-white mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-lg">
        <a href="/" class="hover:text-[#aaff33] transition-colors">Home</a>
        <span class="text-white/50">/</span>
        <a href="/participating-states" class="hover:text-[#aaff33] transition-colors">Participating States</a>
        <span class="text-white/50">/</span>
        <span class="font-semibold text-white">{full_name}</span>
      </nav>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-4xl mx-auto tracking-tight drop-shadow-md">{full_name}</h1>
    </div>
  </section>

  <main id="main" class="py-20 bg-white">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 space-y-16">
      <img src="../images/{slug}.png" alt="{full_name} Map" class="w-full rounded-lg shadow-lg mb-8">
      <div class="space-y-6">
        {content}
      </div>
    </div>
  </main>

  <!-- Partners -->
    <section id="partners" class="py-24 bg-gray-50">
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
    <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
      Partners & Stakeholders
    </h2>
    <p class="text-lg text-gray-600 mb-10">
      Our initiatives are supported by key national and international organizations
    </p>

    <!-- Centered Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 justify-items-center place-items-center">
      
      <!-- Partner 1 -->
      <div class="h-32 w-64 flex items-center justify-center bg-white rounded-xl shadow hover:shadow-lg transition">
        <img src="../images/ministry_of_water.jpeg" alt="Ministry of Water Resource"
             class="h-20 w-auto object-contain rounded-md" loading="lazy" decoding="async" />
      </div>

      <!-- Partner 2 -->
      <div class="h-32 w-64 flex items-center justify-center bg-white rounded-xl shadow hover:shadow-lg transition">
        <img src="../images/world_bank.jpeg" alt="The World Bank"
             class="h-20 w-auto object-contain rounded-md" loading="lazy" decoding="async" />
      </div>

      <!-- Partner 3 -->
      <div class="h-32 w-64 flex flex-col items-center justify-center p-4 bg-blue-500 rounded-xl shadow-lg text-white hover:bg-blue-600 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 22s8-4 8-10a8 8 0 10-16 0c0 6 8 10 8 10z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <p class="mt-2 font-semibold text-sm md:text-base">Participating States</p>
      </div>

    </div>
  </div>
</section>

<footer class="bg-custom-dark-footer text-white">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 border-b border-white/10 pb-8 mb-8">
        <div>
          <div class="flex items-center space-x-3 mb-3">
            <img src="../images/spin_logo.jpeg" alt="SPIN Project Logo" class="w-12 h-12 object-contain" />
            <h3 class="text-xl font-extrabold tracking-wider text-[#aaff33]">SPIN Project</h3>
          </div>
          <p class="text-sm text-gray-300">Sustainable Power and Irrigation for Nigeria — building a resilient future through integrated water and energy solutions.</p>
        </div>
        <nav aria-label="Quick Links">
          <h4 class="text-base font-bold mb-3">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/about" class="text-gray-300 hover:text-[#aaff33]">About</a></li>
            <li><a href="/mandate" class="text-gray-300 hover:text-[#aaff33]">Mandate</a></li>
            <li><a href="/gallery" class="text-gray-300 hover:text-[#aaff33]">Gallery</a></li>
            <li><a href="/contact" class="text-gray-300 hover:text-[#aaff33]">Contact</a></li>
          </ul>
        </nav>
        <nav aria-label="Resources">
          <h4 class="text-base font-bold mb-3">Resources</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-gray-300 hover:text-[#aaff33]">Project Documents</a></li>
            <li><a href="#" class="text-gray-300 hover:text-[#aaff33]">Reports</a></li>
            <li><a href="#" class="text-gray-300 hover:text-[#aaff33]">News & Updates</a></li>
            <li><a href="/contact" class="text-gray-300 hover:text-[#aaff33]">Contact</a></li>
          </ul>
        </nav>
        <div>
          <h4 class="text-base font-bold mb-3">Connect</h4>
          <div class="flex gap-3">
            <a href="#" class="text-gray-300 hover:text-[#aaff33] rounded p-1 focus:outline-none focus:ring-2 focus:ring-[#aaff33]" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2 1.7-1.4 3-3.6 3.4-6.3-4-.5-8.2-2-10-5 0-1.4.3-2.8 1-4 3.7 4.5 9 6.2 14.5 4.5 0-1.4-.4-2.7-1.2-3.8z"/></svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-[#aaff33] rounded p-1 focus:outline-none focus:ring-2 focus:ring-[#aaff33]" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-[#aaff33] rounded p-1 focus:outline-none focus:ring-2 focus:ring-[#aaff33]" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><circle cx="17.5" cy="6.5" r="0.5"/></svg>
            </a>
          </div>
          <p class="mt-4 text-xs text-gray-400">Email: <a href="mailto:info@spinproject.ng" class="hover:text-[#aaff33]">info@spinproject.ng</a></p>
        </div>
      </div>
      <p class="text-center text-sm text-gray-400">&copy; 2025 SPIN Project. All rights reserved. Supported by the World Bank.<br> Developed by <a href="https://es2.com.ng" target="_blank" class="text-[#aaff33] hover:underline">ES2 LIMITED</a></p>
    </div>
  </footer>

  <script>

    const menuBtn = document.getElementById('mobile-menu-button');
    const menuPanel = document.getElementById('mobile-menu');
    menuBtn?.addEventListener('click', () => {{
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      menuPanel.classList.toggle('hidden');
    }});

    const sInput = document.getElementById('search-input');
    const sToggle = document.getElementById('search-toggle');
    function expandSearch() {{
      sInput.classList.remove('search-collapsed');
      sInput.classList.add('search-expanded');
      sToggle.setAttribute('aria-expanded', 'true');
      sToggle.setAttribute('aria-label', 'Close search');
      setTimeout(() => sInput.focus(), 150);
    }}
    function collapseSearch() {{
      if (sInput.value.trim() !== '') return;
      sInput.classList.remove('search-expanded');
      sInput.classList.add('search-collapsed');
      sToggle.setAttribute('aria-expanded', 'false');
      sToggle.setAttribute('aria-label', 'Open search');
    }}
    sToggle?.addEventListener('click', () => {{
      if (sInput.classList.contains('search-collapsed')) {{
        expandSearch();
      }} else {{
        collapseSearch();
      }}
    }});
    sInput?.addEventListener('blur', collapseSearch);
  </script>
</body>
</html>'''

if __name__ == '__main__':
  for slug, data in states_data.items():
    html = base_html.format(
        full_name=data['full_name'],
        slug=slug,
        content=data['content']
    )
    with open(f'states/{slug}.html', 'w') as f:
        f.write(html)
    print(f'Created {slug}.html')