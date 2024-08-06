FUENTE: alnuaimi2023blockchain Blockchain‑based system for tracking and rewarding recyclable plastic waste

Abstract: Industrialization and the rapid increase in the world population have led to the generation of a large amount of plastic waste. Efficient recycling of such waste and fairly rewarding the general public for their services and efforts are two challenging problems. A large portion of today’s systems and technologies that are leveraged for managing plastic waste disposal pro- cesses and rewarding people for their services fall short of providing transparency, traceability, reliability, security, and trust features. In this paper, we propose a blockchain-based solution for managing and tracking recyclable plastic waste using the Ethereum blockchain, along with decentralized storage technology to handle massive volumes of data. Our proposed solution also introduces a reward scheme for people to honor their efforts. Also, our proposed solution establishes trust and accountability among stakeholders who typically participate in the waste management system and also ensures fair reward practices. We present the system architecture along with full implementation and testing details. For better usability, we deploy a decentralized application (DApp) on top of the smart contracts. We evaluate the proposed solution’s functionality and performance using security and cost analyses and compare it with the existing solutions. Our results demonstrate that adopting a blockchain-based approach reduces inefficiencies and is an economical and commercially viable solution. We also make the smart contracts’ code publicly available on GitHub.

Hence, encouraging recycling with the aim of diverting plastic bottles from landfills is of great importance. Both people who make an effort to recycle and those who do not express that they are unaware of who is handling recyclable waste, how it is handled, and whether it is actually being recycled. The ambiguity of the waste man- agement process has led to a lack of motivation to recycle as the results of the process are not observable. According to [4], American recyclable plastic waste is exported to devel- oping countries in exchange for monetary sums. The expor- tation of plastic waste presents serious ethical concerns as the plastic is mismanaged, thus posing a significant threat to local residents. Providing total transparency of the recycling process will not only encourage the public to recycle, but will also help authoritative entities regulate waste manage- ment companies and how they deal with plastic waste.

The forward supply chain of plastic bottled water involves delivering bottles from manufacturing plants to consumers. This half of the supply chain is transparent in comparison to the reverse chain. The reverse supply chain involves the col- lection of used water bottles, sorting, and preparing them for re-manufacturing. In addition, the traditional linear economy approach used for plastic handling depletes resources used in plastic manufacturing [5]. The study conducted in [6] presents the potential harm that linear economy approaches of solid municipal waste pose on the environment. This is why plastic production, alongside numerous other industries, is attempting to move from the traditional linear economic approach to a circular economy where resources can re-enter the supply chain, instead of being wasted. All these difficul- ties in handling recyclable plastic waste prove the need for a system that provides traceability of recyclable plastic waste while encouraging the general public to recycle more often.

A number of technology-based and non-technology- based waste management solutions have been operational in the UAE. Non-technology-based solutions mostly consist of municipality-retailer collaborations for the collection of post-consumer recyclable plastic bottles [7]. The collected plastic is either dumped into landfills, allocated to recycling facilities, or entered into waste-to-energy programs. As for technology-based solutions, the Bee’ah Reverse Vending Machine (RVM) is a prominent example. The RVM is a col- lection machine utilizing Internet of Things (IoT) technology to reward the participant with a receipt to enter a monthly draw for depositing plastic bottles and aluminum cans [8]. Another example of a technology-based solution is ZeLoop, a blockchain-based mobile application that offers monetary rewards for depositing plastic waste in verified recycling locations [9]. At a verified disposing location, the user uploads a picture of their disposed plastic bottles. An algo- rithm is run to estimate the number of bottles and rewards the participant with an Ethereum-based token accordingly. While these solutions do a decent job of incentivizing recy- cling, they do not solve the issues of ambiguity and lack of transparency.

In this paper, we propose a blockchain-based system to provide an end-to-end traceability solution for tracking recyclable plastic waste and a secure approach to reward- ing recyclers for their participation in green habits. The proposed solution is feasible through the use of blockchain technology because of its inherent characteristics such as decentralization, immutability, and security. By utiliz- ing blockchain capabilities, we demonstrate an automated method to allocate recyclable waste to vetted manufacturers to be reused through an auctioning mechanism. By taking this approach, we achieve our ultimate goal since full trans- parency is essential to building trust, motivating sustain- able practices, and creating an optimised supply chain for stakeholders to increase recycling. Moreover, we designed our solution using the Ethereum platform because Ethereum is popular with both public and private networks.

• We propose a blockchain-based approach for transpar- ent tracing of recyclable plastic waste. The proposed approach dynamically maps a unique hash to plastic bales. Hence, plastic waste can be tracked in a manner that is decentralized, transparent, reliable, secure, and trustworthy.

• We implement an auctioning technique to ensure a fair allocation of recyclable waste to manufacturers. In addi- tion, a rewarding mechanism for recyclers is introduced as an incentive in exchange for their plastic waste.

• We develop four Ethereum blockchain-based smart con- tracts. We discuss the sequence of interactions showing the function calls and events. We explain the different functionalities of the smart contract. We present impor- tant features of the deployed decentralized application (DApp). We make our smart contracts code publicly available on Github 1 .

• We present implementation and testing details of the developed smart contracts and the DApp. We conduct cost and security analyses to evaluate the performance of the proposed blockchain-based tracing and rewarding recyclable plastic waste management system. Addition- ally, we compare our proposed approach with the existing solutions

Estado del arte: Destaca soluciones previas utilizando únicamente IoT. A diferencia de otros trabajos (SmartCitizen App), el trabajo 23 elimina la necesidad de bolsas inteligentes al rastrear individualmente los desechos, específicamente los plásticos. El modelo propuesto utiliza códigos de respuesta rápida (QR) impresos en plásticos en el momento de la fabricación. El código QR contiene la dirección criptográfica y detalles plásticos. Las partes interesadas de este sistema incluyen el público en general, los usuarios finales, los recolectores de basura, los fabricantes, los minoristas, el gobierno, los gobiernos locales y las unidades de reciclaje. Esta solución integra IoT a través de contenedores que leen los códigos QR de los productos. Posteriormente, se otorgan recompensas a participantes individuales, fabricantes y unidades de reciclaje a través de ZEROApp. La tecnología Blockchain se utiliza para gestionar tokens y rastrear plásticos. Las recompensas se utilizan para el pago de bienes y servicios. El modelo puede hacerse conveniente y rentable reemplazando varios contenedores inteligentes con una máquina clasificadora inteligente en las instalaciones. El trabajo presentado en este artículo proporciona una solución mejorada a los artículos revisados. Este sistema proporciona una solución rentable al implementar dispositivos inteligentes únicamente en las instalaciones de clasificación. Por el contrario, los estudios mencionados propusieron dispositivos IoT en barrios y camiones de recogida. Además, el sistema añade comodidad al eliminar las bolsas inteligentes y la interacción del usuario final con los dispositivos IoT.

...

---

Fuente: liu2021plastic - Plastic credit: A consortium blockchain-based plastic recyclability system

Plastic waste has become one of the most formidable environmental problems of our age, and solving it without increasing other environmental burdens will require approaches that tackle wider concerns around the unsustainable use of resources. However, at present, recy- cling technologies and waste management systems do not yet record the impacts due to the amounts of plastic waste being gen- erated.Encouraging customers to reduce single use plastic consump- tion and motivating plastic producers to produce more recy- clable plastics are essential to the health of the global environment.

Important to our study is the fact that more than 20 dif- ferent recycling labels for plastic alone exist in the market, and customers are confused about which plastic products are recy- clable and which products are actually recycled. clear plastics labelling is a powerful way to help consumers buy more recyclable and recycled products and to dispose of them correctly.

To address the problem of ambigu- ous plastic labeling, this paper proposes a credit system based on the quality of the plastic. From the outset, however, this study finds that the main challenge behind the credit system is the engendering of trust between customers and plastic pro- duct manufacturers, and among plastic producers and manufac- turers of goods which use plastic, where neither verification of actual plastic usage nor credit authenticity in this process can yet take place. A transparent and secure platform for generating and checking credit information is therefore essential in the plastic management system.

Large companies or organizations need to be responsible for the plastics they make, use, or sell, and the note is issued by a third accredited party, a reprocessor, as evidence of the receipt of a certain tonnage of packaging waste. However, such a centralized system generally has significant drawbacks, such as a crisis of trust caused by recycling information asym- metry and information that can be tampered with easily. Decen- tralization can solve this problem by providing an immutable record within a trusted environment. Blockchain provides the equitable management of credit information and interface for the public to check on a secure distributed ledger book

In this context, we propose a blockchain-based PlasticChain for managing the plastic credit for plastic products/companies. In a PlasticChain system customers are able to retrieve credit information as a reference before choosing a product. Plastic producers and product manufacturers can publish means of production contracts and plastic production information to form a self-regulated body that can check the information’s validity.

In order to promote waste prevention, government and local authorities have also proposed economic instruments, including taxes, fees and charges, Deposit-Refund Systems (DRS), subsidies, a tradable permit system, and so on. These instruments use different economic models to stimulate municipal waste prevention and improve resource efficiency.

In the public blockchain, participants are allowed to take part anonymously, and access the network and blockchain without permission. The transactions on the blockchain are available for checking, and all peers are allowed to make transactions (Jaag and Bach, 2017). In the consortium blockchain, access and update operations are only allowed for members of the consortium. Only the selected set of nodes are responsible for validating the blockchain in the network (Marc, 2016). The private blockchain is applied in private organizations for database management and auditing.

PlasticChain is a plastic product-based blockchain system in which products containing raw plastic are produced by private sector plastic manufacturers. The label on the plastic product gives the plastic credit information, and may also contain the plastic type and composition (given on a voluntary basis). Users are able to collect the plastic information from the label and verify its authenticity on PlasticChain. The plastic products are labelled by manufacturers where the corresponding factory or company is responsible for providing the correct information to customers. The information is distributed in an off-chain manner so that it is not directly involved in the blockchain. As illustrated in Fig. 1, PlasticChain can be divided into several different components described as follows:

---

FUENTE: sandhiya2020investigating - Investigating the Applicability of Blockchain Technology and Ontology in Plastics Recycling by the Adoption of ZERO Plastic Model

Plastics have ranked the fourth place in the production of waste, whereas it has taken the last rank in the process of recycling. Recycling materials have to be ensured to be properly processed without being incinerated. Blockchain technology has to be utilized in order to encourage recycling of plastics, integrate accountabil- ity and escalate the efficiency in the plastic industries. The suggestions discussed in this paper help the government to improve the quality of recycling the plastics, to create aware- ness about recycling habits, to improve the transparency and accountability in the journey of recycling and to cut down the costs involved in the recycling process.

To effectively actualize the blockchain innovation in plastic industry, the following difficulties must be managed: (an) an overcoming administration regarding government which needs to make up for the initiative shortcoming; (b) fundamental changes must be bought in across the whole business; (c) change of the business into digital mode, utilizing blockchain to make advertises and adapt plastic bundling waste; (d) im- provement of characterized environment to incorporate cooperation around mechanical principles and technological standards; and (e) uncovering mindfulness among to light a fire under entrepreneurial activity by supplying clear incentives to do things differently, whether in terms of collecting, sorting, recycling, repurposing or innovating new materials.

The proposed ZERO model uses QR codes; by turning the crypto address into the QR codes, the model smoothens the crypto currency transactions by adding a label pointing the receiver and the tokens requested. Usage of QR codes has many benefits such as user convenience, integration with me- dia (like mail, bill boards), ease of handling page traffic, de- vice independent, measurable analytics and inexpensive.

Ontology is an instrument that can be used to reduce the concep- tual ambiguities and inconsistencies by identifying the value cre- ating capabilities in the domain of plastic industry (Guarino et al. 2009). Ontology reduces the complexity by structuring domains of interests (Noy and McGuinness 2001).The benefit of using ontology in a product’s lifecycle and data exchange is the ability to collect a set of information beyond available data and to en- hance the level of details about the product including when it is being used, how and by who.

The circular economy is built on cycling products and ma- terials across various vales in the supply chain; descriptions about the product such as materials composition, condition and potential to be reused and recycled are the key (European Statistics n.d.). Circular economy (CE) ontology is a high-level view of the data models that are used to de- scribe various members in the circular economy which in- cludes virtual entity (VE) (e.g. SmartTag, QR codes as a unique digital ID), users (e.g. manufacturers, retailers, end consumers, recycling units) and services. Figure 3 shows the circular economy of the ZERO model. CE ontology is imple- mented using web ontology language (OWL).

Most of the existing systems does not track individual plastic items and does not provide information about how much ma- terials are recycled and returned. ZERO model focuses on overcoming this significant audit challenges by developing a system which is auditable, fraud resistant and economically practical. The proposed model tracks the individual plastics from one end of the lifecycle to the dead end, in order to bring a revolution in the lives of plastics. ZERO is a completely monitored blockchain-based waste management system. The concept of digital twins QR codes is used that is printed at the time of manufacturing without marginal costs.

ZERO bin is designed as a reverse vending machine that only accepts plastics with an active QR code with an active credit. The actual credit is a marginal amount which is fixed for each plastic product with respect to each company. The bin is designed using the sensors that read the QR code of the plastic products. The refund process starts as the consumer scans the plastic product.

The plastic that is deposited in the bin has to be empty and this could be found by the digital twin’s concept of QR codes. This is made easy as the twin data fixed into the blockchain metadata associated with the plastic’s QR code identifies how much the product weighed at the time of manufacture. Thus, bin weighs the plastics, compares the product’s weight and refunds the credit. Bin intakes the plastics and issues the re- funds. Bin has around 4 compartments which are used to sort the plastic product with respect to the CO2 footprint. The footprint details enable the recycler to accurately measure the composition of each plastic waste. The products become smart with its ID.

n association for the proposed model is formed named “ZERO Board” which acts as a non-profit foundation consti- tuting the members in the ecosystem. The board will get a reward for every plastic product that gets recycled. The model brings in a circular economy which guarantees the sustainabil- ity. ZERO model chains the public, end consumer, garbage collectors, manufacturers, retailers, government, local bodies and recycling units. ZERO improves the lives of garbage col- lectors, by providing them with a new source of income for their responsible behaviour. As a plastic collector collects and delivers the plastic waste, they are issued with green tokens as digital rewards.

For the industries, ZERO model makes it easier to meet recycling targets because the stage of mechanical sorting of the plastics which is more expensive is eliminated.

The stages involved in the execution of the ZERO model with respect to end consumer, manufacturer, retailers, govern- ment and recycling units are the following:

1. Digital ID’s are issued.
2. Product manufacturers make request for digital IDs and once obtained print the QR code onto each of the product.
3. Data printed on the products such as size, weight, geo- graphical location of manufacturing unit, content and other design details of the cap and product is sent to the distributed ledgers.
4. Products reach the retailers from the manufacturer.
5. When the products are sold, QR codes are scanned and details such as retail chain, shop ID and timestamp are appended. A marginal amount is charged as part of the buying price. This amount is sent to the address of the product’s QR code.
6. Retailers are rewarded for performing the scanning of products and the reward is released when the product is ingested to the ZERO bin at the later stage (after the usage of the product).
7. When the products are used and disposed in the bin, the role players are rewarded.
8. Bin creates a block each time, it is full and the block has its unique digital ID.
9. Local governments can own the bins to grow their rev- enue streams as the bin is rewarded a marginal amount for processing every plastic product.
10. ZERO bin is a smart bin which monitors the capacity and communicated over the network where these reports are sent to collection agents.
11. Agents scan the digital ID of the block and collect the filled plastics and places a new block with a unique ID.
12. Agents bring the blocks to an aggregator who scans the blocks; at this stage, the agents are rewarded. Agents are additionally rewarded if they follow the shortest path to reach the aggregator suggested by the ZEROApp (Dijkstra’s algorithm is used to sort out the shortest path). 13 Blocks are compressed and broke into “bonds” contain- ing 1 lakh (1,00,000) plastics each. Bond has unique ID composed with the data about the block. 14 Aggregators are rewarded when the bonds are delivered to the recycling units. 15 The rewards are credited to the recycling unit, as they scan the bonds and get the details about each plastic product.

Smart contracts in the ZERO model release the credit amounts of the plastic products that have not recycled to the government. Thus, the ZERO model thus brings a circular economy and contributes towards sustainability development.

Extended producer responsibility (EPR) is a strategy to add all of the costs involved in the environment that are associated with the product throughout the life cycle of a product to the market place of that product. ZERO mod- el is a solution for recycling the plastic and it adds more re- sponsibility to all the role players in the supply chain. The inclusion of CO2 footprint details in the ID is an added value to the society which provides details of the climate ef- fects of plastic products.

Tamper-Proof QR codes are inserted at the macromolecular level of the polymer; henceforth, the issue of damaging or tampering is not an issue which would rather does not affect the QR code.

This paper proposes ZERO model a blockchain-based trace- ability system for recycling the plastic products to provide transparency, provenance, safety and security. Since there has been an increase in the deposit of the plastics in a huge volume in the landfills, IoT-enabled smart bins are designed to bring an effective solution. A knowledge base is developed for the smart bins by using ontology. The proposed model brings benefits to all the stakeholders in the supply chain. Implementation of the model across the globe will improve the nature and brings changes in the behaviour of the consumers and increases the revenue rate for the gov- ernment. Further to this, developed model enables data exchange in the supply chain to bring up the circular economy.

Conclusiones:

- Combinan IoT (QRs y containers) con blockchain para rastrear y recompensar la recolección de plásticos.
- Dan recompensas monetarias a los usuarios por reciclar.
- Trackean cada producto plástico individualmente con un "gemelo digital" (QR).
- Beneficia a los recolectores de basura con una nueva fuente de ingresos. (no perjudica actores preexistentes)
- Cada eslabón de la cadena es recompensado cuando el siguiente cumple su parte, estimulando a los mismos actores a estimular a los siguientes.

---

FUENTE: BHUBALAN2022113631 - Leveraging blockchain concepts as watermarkers of plastics for sustainable waste management in progressing circular economy

Among all the strategies for reducing plastic waste, recycling is the best option and is the key lever to keep renewable energy con- sumption low as well as limit competition for biomass demand and optimise economics (Mangold and Vacano, 2022). However, despite a huge increase in public awareness regarding the negative impacts of plastic pollution and participation in recycling programmes, the current waste disposal and management system is still lagging in processing plastic waste for recycling and reuse. Global recycling and reusing plastics have their limitations as they are highly dependent on consumer behaviour, different types of plastic require sorting, identification and different recycling processes, and are usually costly (Abadi and Brun- nermeier, 2018). Most recyclable plastics in Thailand, the Philippines and Malaysia have lost more than 75% of their material value.

this review focuses on addressing the issues in plastic waste management by using different approaches of blockchain tech- nology coupled with molecular tagging to create chemistry-based redesigned plastic (Bucknall, 2020). This could achieve closed-lopped recycling while maintaining the value of synthetic plastics for an extended time to achieve a global scale circular economy model.

Redesigning plastics using blockchain technology simply means the origin of plastics could be easily traced from the start until the end and the data would be immutable, transparent, secure and efficient. Block- chain can support a circular economy in several ways through infor- mation transparency, reliability and automation which can effectively leverage circular economy initiatives. Also, information about the plastic such as the source of material, involved actors, processes and other relevant information can be made available on the ledger .

Collectively, the goal of a circular economy is the efficient use of waste, waste minimisation and sustainable development (Kee et al., 2021). However, the circular economic model of plastics is impeded by various factors such as sorting of plastic based on polymer type, tracing of waste and past usage records (food and non-food) as illustrated in Fig. 3 along with significant economic, legislative and business part- nership hurdles (Bucknall, 2020). This can be done using the ‘digital product passport’. It’s known that one big obstacle in achieving the circular economy is the lack of trustworthy, verifiable information about the product reuse, its content and recycling potential. A digital product passport can help close this information gap as proposed as the second phase initiative by the European Commission. . As per the new plan, supply chains should include ‘product passports’ disclosing the sus- tainability performance of each product so that users across the supply chain can reuse it or treat it correctly at waste management facilities. Besides, the Extended Producer Responsibility (EPR) policy regulation motivates the solid waste management companies to embrace block chain technology innovation.

The applications of sequence-controlled polymer in blockchain are important for plastic recycling as it provides a unique code for the plastic-based or plastic-containing products for the identification of authentic information, as well as tracing the transactions of the plastic products, thus minimising plastic waste. Security Matters, Australia is a company focusing on digitising physical objects on the blockchain, has successfully marked recycled plastics. This company uses a track & trace solution utilising a sub-molecular hidden ‘marker’ system, a unique ‘reader’, and a ‘blockchain record’ providing transparency and authen- tication (Security Matters Limited).

Anticounterfeiting technologies have become indispensable to pro- tect manufacturers, consumers, and entrepreneurs to avoid the pro- duction of counterfeit products over the last decades. The cheap replicas of genuine products may cause harmful effects on humans and life. The use of molecular or nano identification tags enables the manufacturer to track the batch number and production date of given products, as well as distinguish a genuine product from a counterfeit. Sequence-controlled polymers have been suggested as a new option for anticounterfeiting materials.

synthetic sequence-controlled polymers have become important for data storage and anticounterfeiting (Martens et al., 2018), as well as in plastic industries to minimise the environmental impacts caused by growing consumption, mass production, and the short life- span of plastic materials and products. The “molecular barcode” could be embedded in the plastic products during manufacture to store various information about the plastics’ life cycle in a binary system. The binary information can be easily written on two monomers in the synthetic sequence-controlled polymer defined as 0- and 1-bit and this digital sequence can be recovered using sequencing technologies, usually tan- dem mass spectrometry (MS/MS). Thus, information containing poly- mers could, in principle, have very simple molecular structures.

Identifying and sorting plastics has its limitations especially when it involves manual work. The current technology of using spectroscopic- based sensors such as near-infrared (NIR) has various disadvantages including identifying products composed of multiple plastics or black plastics, data on past usage, the inhibitory effect of foreign substances and the inability to differentiate plastics with a similar molecular structure (Maris et al., 2012; Woidasky et al., 2020). Other approaches such as chemical tagging, fluorescent tracers, digital watermarking, quick response (QR) and radio frequency identification (RFID) tagging of plastics products have also been attempted.

It reviews tagging approaches and blockchain technology for plastic waste man- agement are detailed in the following sections and can be categorised into product development and establishment of closed-loop recycling.

Plastics are both a global boon and a bane. Manufacturers mass- produce plastics to accommodate the constant demand, especially dur- ing the Covid-19 pandemic whereby face masks, face shields and other PPE were in high demand. The cost to manufacture single-use plastics or multi-use (eg. plastic containers) is unprecedented. According to a report by The Boyd Company Inc (2016), the annual operating costs of a plastic manufacturing plant in the Northeast US ranged from $14.4 million to $18.7 million.

Waste collection and transport alone can generate up to 70% of municipal solid waste costs (Greco et al., 2015). The entire municipal solid waste activities involve up-front costs (initial investments in the necessary equipment for waste collection and transport), operating costs (expenses of managing namely collection, transportation, sorting and disposal of wastes) (Gopalakrishnan et al., 2020) and back-end costs (expenses in the proper care of landfills) (Boskovic et al., 2016). How- ever, the handling of plastic waste is often considered a separate and an additional cost in most countries.

Current use of technology for tracing plastic, RFID, QR code, image recognition and mini-apps are cheap and easily accessible. However, these technologies have their shortcomings, for instance, RFID tags consist of a chip, antenna and substrate (silicon, copper and silver), materials not commonly found in the materials waste flow which will disrupt recycling centres and their technologies (Aliaga et al., 2011). QR codes, image recognition and mini-apps have been implemented in China for more efficient waste management (Liao, 2019) and can identify ‘compostable’, ‘dry’, ‘toxic’ or ‘recyclable’ wastes just by typing the keywords into the search box. The incorporation of such technolo- gies has allowed a non-environmentally conscious person to segregate their waste accordingly.

Plastic recycling could be further ramped up by the application of molecular tagging to close the loop. As proposed by Sandhiya and Ramakrishna (2020), the ZERO model uses molecular tagging technol- ogy to trace and identify the tagged plastic from the start to the end. This model also utilises the security of blockchain to keep track of the tagged plastics. The information regarding the plastic (type, production date, weight, colour, manufacturer, unique ID) will be almost permanent. However, molecular tagging requires high-end machinery (eg. tandem mass spectrometry) and expertise (eg. molecular chemist) which comes with a cost, raising the question of whether molecular tagging is appli- cable to single-use plastics? Producing a molecularly tagged garbage bag may result in a very ‘expensive’ garbage bag. In contrast, digital watermarking utilises barcodes for sorting. The digital watermark is an optical code about the size of a postage stamp on shrink sleeves or embossed around the body of the plastic (Pioneer Project, 2019) which is created by integrating subtle micro-topological variations which are not recognisable by humans.

developing a blockchain system is expensive:

Estimated costs for setting up new and integrating blockchain with existing platform. Case 1. New blockchain platform, Public, Financial transactions (required), Third party services integration, all parties interfacea, Proof of concept, 4-different type of users Estimated time ~31 weeks Development costs $109,900 - $172,700 Maintenance costs $11,932 - $13,188 Third party costs (Monthly) $2355 Case 2. Integrate blockchain with an existing platform, Public, Financial transactions (required), Third party services integration, all parties interfacea, Proof of concept, 4 different type of users Estimated time ~29 weeks Development costs $102,900 - $161,700 Maintenance costs $11,172 - $12,348 Third part costs (Monthly) $2205

There is a far greater understanding and awareness of the importance of plastic waste, recycling, environmental and the economic impact of climate change and the use of raw materials. However, all the efforts taken to date have been in vain and not completely practical due to the structural challenges and lack of improved technologies in plastic waste segregation and recycling processes, and the lack of reliable data about recycled plastics (Chidepatil et al., 2020). Replacing plastics with bio- polymers requires many improvements to be as equally competitive in terms of quality, cost and production as synthetic plastic materials (Moharir & Kumar, 2018). Unclear disposal pathways and the lack of cost-effective and environmental-friendly alternatives to plastics will disrupt the process of curbing the entire issue from its root cause (Hopewell et al., 2009; Moharir & Kumar, 2018). Blockchain imple- mentation in plastics and waste management has already begun to provide significant benefits and has greater potential in the future with the upcoming technology. The identification of the com- ponents of waste materials and segregation of hazardous components utilised in materials becomes easier compared to recycling (Chidepatil et al., 2020; ISBGlobal, n.d.). The safety and legitimacy of disposal and treatment could be tracked for both recycler and materials which could help eradicate waste crime, illegal shipments and dumping of materials (ISBGlobal, n.d.). The public will also be aware and be able to track the impact of their recycling efforts.

As the world population is surging due to industrialisation and better quality of life, the amount of waste generated will also increase. An effective way to manage waste and achieve a circular economy is the conversion of plastic waste into value-added products (Mahari et al., 2018; Lam et al., 2019). However, the circular economy does not always require the conversion of waste, simply maintaining the waste in the loop for as long as possible to minimise waste generation and fluctuation of resource commodities (Kee et al., 2021). Chemically redesigning plastics requires administration, expertise, labour etc. and can create job opportunities to support knowledge transfer to improve the system and reap profits in the long term. The ability to manufacture, mark, trace, re-mould and reuse can effectively usher the world into a new plastic world. The adoption of the circular economy principle can redirect na- tions to a more sustainable economy, allowing the environment to recover from the previous stresses.

Finally, blockchain is a developing technology, its use in a domain often becomes the focus rather than the underlying problem being solved (Taylor et al., 2020). Further research is thus required to identify the problem before comparing the possible policy or technological re- sponses in terms of their economic, environmental, and social effec- tiveness and efficiency. Regardless, the use of blockchain is often seen as a positive factor and can be beneficial in attracting the public’s attention to resolve economic and environmental issues. The chemical recycling of plastic is the future and the proper infrastructure to do this is gradually being put in place (Allison, 2020). However, necessary actions must be taken by clearly communicating the pros and cons to the public and overcoming limitations to reap the full benefits. Blockchain imple- mentation in plastics coupled with efforts to increase the use and spec- ification of recycled grades to replace virgin plastic should be the top priority in future to address the worsening environmental and economic problems.

Conclusiones:

- Este paper está más enfocado en la parte de Chemical perspective of redesigning polymer from molecules for recycling purposes.
- Revisa una lista de proyectos actuales que utilizan blockchain para el reciclaje.
- Analiza que el costo de implementar blockchain es alto, puede no ser rentable para plásticos de un solo uso.
- Remarca la importancia de identificar cada plástico individualmente para su reciclaje mediante algún tipo de marcado.

---

Plastic bank Plastic Bank was founded in 2013 with the concept of paying people for collecting plastic waste to prevent marine plastic pollution while providing an additional source of income. They currently operate in Haiti, Brazil, Indonesia, the Philippines and Egypt and have retrieved more than 20 million kg of plastics, recording the waste collection in real-time using blockchain technology (PlasticBank, n.d.-b). Plastic Bank operates on a commercial scale along with major corporations such as Marks & Spencer, Lombard Odier, Greiner Packaging, Henkel, Carton Pack® and S. C. Johnson. Impact guarantee and Social Plastic® part- nerships are provided to encourage companies to actively participate in this programme which highlights corporate social responsibility and provides a positive image for the companies. The Social Plastic® part- nership programme allows companies to source recycled plastic as feedstock for their product manufacturing, with plastics such as PET, LDPE, and HDPE and yarn available for purchase. Furthermore, larger corporations such as S. C. Johnson have established recycling centres in Indonesia and Brazil to directly source recycled plastic feedstock. Social Plastic® Collection Credits (SPCC) where one SPCC is valued at USD 0.50 (2021) equivalent to 1 kg of plastic waste prevented from entering the ocean functions similar to carbon credits. This enables plastic waste collection as a source of income to address poverty issues (PlasticBank, 2018). IBM blockchain technology plays a crucial role in monetary transactions, the transparency of the value chain and real-time data visualization of plastic waste. The distribution of SPCC tokens is made possible using a mobile application based blockchain platform and in- dividuals can safely spend the token for daily necessities (Mok, 2018). Blockchain technology enables the track and trace of plastic waste, allowing corporations to record and highlight their efforts in reducing the plastic footprint (IBM, n.d.).