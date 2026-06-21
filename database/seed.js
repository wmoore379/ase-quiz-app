const db = require('./db');

const categories = {
    G1: "Auto Maintenance and Light Repair",
    A1: "Engine Repair",
    A2: "Automatic Transmission/Transaxle",
    A3: "Manual Drive Train & Axles",
    A4: "Suspension & Steering",
    A5: "Brakes",
    A6: "Electrical/Electronic Systems",
    A7: "Heating & Air Conditioning",
    A8: "Engine Performance",
    A9: "Light Vehicle Diesel Engines",
    F1: "Alternate Fuels"
};

const quizData = {
    G1: [
        {
            question: "Technician A says that when testing a battery, a load test should be performed for 15 seconds at one-half of the CCA rating. Technician B says that a battery must be at least 75% charged before performing a load test. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 2,
            explanation: "Both technicians are correct. A load test is performed at 1/2 the Cold Cranking Amps (CCA) for 15 seconds. However, if the battery state of charge is below 75% (approx 12.4 volts), it must be charged before load testing, otherwise it will fail the test falsely."
        },
        {
            question: "A vehicle has a steady pull to the right while driving straight ahead. All of the following could cause this EXCEPT:",
            options: ["Unequal tire pressure", "A bent strut", "A worn outer tie rod end", "Excessive positive camber on the left front wheel"],
            correct: 2,
            explanation: "A worn outer tie rod end will cause steering wander, free play, or a clunking noise, but it typically does NOT cause a steady pull in one direction. Unequal tire pressure and improper camber/caster angles are primary causes of a pull."
        },
        {
            question: "When performing an engine oil and filter change, Technician A says to inspect the old filter to ensure the rubber gasket was removed with it. Technician B says to apply a heavy coat of RTV silicone to the new oil filter gasket. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 0,
            explanation: "Technician A is right. A 'double gasket' will cause a massive oil leak upon startup. Technician B is wrong; you only apply a light coat of clean engine oil to the new filter's rubber gasket, never RTV."
        },
        {
            question: "Which of the following is the MOST likely cause of a brake pedal that pulsates only when applied at highway speeds?",
            options: ["Air trapped in the hydraulic system", "Worn brake pad lining", "Lateral runout of the brake rotors", "A restricted brake hose"],
            correct: 2,
            explanation: "Lateral runout (warped rotors) or thickness variation in the brake rotors causes the brake pads to be pushed back and forth, which translates into a pulsating feeling in the brake pedal."
        }
    ],
    A1: [
        {
            question: "Two technicians are discussing a vacuum gauge reading on an engine at idle. The gauge needle fluctuates rapidly between 10 and 22 in. Hg. Technician A says this indicates worn valve guides. Technician B says this indicates a burned exhaust valve. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 0,
            explanation: "Technician A is right. Rapid fluctuation of the vacuum gauge needle at idle indicates worn valve guides. A burned valve usually causes a regular, rhythmic drop in vacuum every time that specific cylinder fires."
        },
        {
            question: "An engine has lower than normal oil pressure. All of the following could be the cause EXCEPT:",
            options: ["Worn main and rod bearings", "A stuck open oil pressure relief valve", "A clogged oil pump pickup screen", "A stuck open PCV valve"],
            correct: 3,
            explanation: "A stuck open PCV valve creates a massive vacuum leak leading to a rough idle, but it does NOT affect engine oil pressure. Worn bearings increase clearances, dropping pressure. A stuck relief valve dumps pressure back to the pan."
        },
        {
            question: "Technician A says that when measuring cylinder taper, the measurement should be taken parallel to the crankshaft and then perpendicular to the crankshaft. Technician B says cylinder wear is usually greatest at the bottom of the ring travel. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 0,
            explanation: "Technician A is right. Measurements are taken at the top and bottom of ring travel, both parallel and perpendicular to the crank to determine out-of-round and taper. Technician B is wrong; cylinder wear is highest at the TOP of the ring travel due to heat, pressure, and poor lubrication at the combustion event."
        },
        {
            question: "A vehicle emits blue smoke from the tailpipe only during deceleration. What is the MOST likely cause?",
            options: ["Worn piston rings", "Worn valve stem seals", "A rich fuel mixture", "Coolant leaking into the combustion chamber"],
            correct: 1,
            explanation: "During deceleration, high intake manifold vacuum pulls oil past worn intake valve stem seals and guides into the combustion chamber. Worn rings typically smoke under acceleration."
        }
    ],
    A2: [
        {
            question: "Technician A says the torque converter stator redirects fluid flow to multiply engine torque. Technician B says the torque converter clutch (TCC) mechanically locks the turbine to the impeller to improve fuel economy at highway speeds. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 2,
            explanation: "Both technicians are right. The stator redirects fluid returning from the turbine back to the impeller. The TCC locks the converter at cruising speeds to eliminate the 200-300 RPM fluid coupling slip, reducing heat and improving MPG."
        },
        {
            question: "An automatic transmission has delayed engagement when shifted from Park to Drive. The MOST likely cause is:",
            options: ["A worn transmission pump", "Low transmission fluid level", "A stuck open torque converter clutch", "Failed planetary gear thrust washers"],
            correct: 1,
            explanation: "Low fluid level causes the pump to draw in air, leading to a delay in building the hydraulic pressure required to engage the forward clutch pack."
        },
        {
            question: "All of the following are holding devices in a planetary gearset EXCEPT:",
            options: ["Multi-disc clutches", "Bands", "One-way roller clutches (Sprags)", "Accumulators"],
            correct: 3,
            explanation: "Accumulators are hydraulic shock absorbers used to cushion shifts by temporarily absorbing fluid pressure. They are NOT holding devices. Clutches, bands, and sprags are used to hold planetary members stationary."
        }
    ],
    A3: [
        {
            question: "A manual transmission jumps out of gear when decelerating down a steep hill. Technician A says a worn shift fork could be the cause. Technician B says worn synchronizer dog teeth could be the cause. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 2,
            explanation: "Both technicians are right. If dog teeth are worn, their reverse-taper lock is lost, allowing the sleeve to slide off. A worn or bent shift fork will fail to fully engage the sleeve, allowing it to pop out of gear under load changes."
        },
        {
            question: "A constant whining noise is heard from the rear differential assembly, but it only happens during acceleration. The noise goes away when coasting. What is the MOST likely cause?",
            options: ["Worn axle bearings", "Worn carrier bearings", "Improper ring and pinion backlash or wear", "Worn spider gears"],
            correct: 2,
            explanation: "A whine that changes depending on load (acceleration vs. deceleration) points directly to the ring and pinion gear contact pattern, caused by improper backlash or worn gear teeth. Carrier and axle bearings whine continuously regardless of load."
        },
        {
            question: "Technician A says that a clutch chatter during engagement can be caused by oil or grease on the clutch friction disc. Technician B says a warped flywheel can cause clutch chatter. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 2,
            explanation: "Both are right. Chatter (a violent grabbing and slipping) is often caused by a contaminated friction disc (oil from a rear main seal leak) or uneven mating surfaces like a warped or hot-spotted flywheel."
        }
    ],
    A4: [
        {
            question: "A vehicle requires constant steering correction to stay in a straight lane on a level highway (wandering). All of the following could cause this EXCEPT:",
            options: ["Loose tie rod ends", "A worn steering gear", "Excessive negative camber", "Insufficient caster"],
            correct: 2,
            explanation: "Excessive negative camber will cause inner edge tire wear but does not typically cause wander. Insufficient caster removes the vehicle's natural tendency to return to center, causing wander. Loose steering linkages allow the wheels to drift."
        },
        {
            question: "Technician A says that the 'Toe' angle is the most critical alignment angle for tire wear. Technician B says that 'Caster' has no effect on tire wear. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 2,
            explanation: "Both are right. Incorrect toe will feather a tire very quickly, making it the most critical tire wear angle. Caster is a directional stability angle and does not cause tire wear."
        },
        {
            question: "When turning the steering wheel on a vehicle with a MacPherson strut suspension, a loud 'popping' or 'boinging' noise is heard from the front end. What is the MOST likely cause?",
            options: ["A worn lower ball joint", "A binding strut mount bearing", "A loose sway bar link", "Worn rack and pinion mounting bushings"],
            correct: 1,
            explanation: "The upper strut mount bearing allows the entire strut assembly and spring to turn when the wheels are steered. If this bearing binds, the coil spring will twist and suddenly pop free, making a loud boing or pop noise."
        }
    ],
    A5: [
        {
            question: "A vehicle's brake pedal slowly sinks to the floor when holding steady pressure at a stoplight. There are no visible external fluid leaks. What is the MOST likely cause?",
            options: ["Air in the brake lines", "A faulty power brake booster", "An internally bypassing master cylinder", "Boiling brake fluid"],
            correct: 2,
            explanation: "When a master cylinder's internal primary cup seals wear out, fluid bypasses the seal under pressure and flows back into the reservoir. This causes the pedal to slowly sink to the floor with no external leaks. Air in the lines causes a spongy pedal, not a sinking one."
        },
        {
            question: "Technician A says that the primary (front) shoe in a duo-servo drum brake system does most of the braking. Technician B says the secondary (rear) shoe has a larger lining because it does most of the braking. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 1,
            explanation: "Technician B is right. In a duo-servo drum brake, the rotation of the drum wedges the primary shoe into the drum, which then transfers its force through the star wheel to forcefully jam the secondary shoe into the drum. Therefore, the secondary shoe does most of the stopping and has a larger lining."
        },
        {
            question: "During a panic stop, the rear wheels lock up before the front wheels, causing the vehicle to skid. Which component has MOST likely failed?",
            options: ["The ABS wheel speed sensor", "The proportioning valve", "The metering valve", "The residual pressure valve"],
            correct: 1,
            explanation: "The proportioning valve limits pressure to the rear drum brakes during hard braking (when weight transfers forward) to prevent rear wheel lockup. If it fails, full pressure goes to the rear, causing a skid."
        }
    ],
    A6: [
        {
            question: "A headlight bulb is dim. Technician A measures voltage at the bulb connector and finds 10.5 volts while the circuit is loaded. Technician B performs a voltage drop test on the ground circuit and measures 2.5 volts. Who is correctly identifying the problem?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 2,
            explanation: "Both technicians are diagnosing the same high resistance issue. Tech A proves the bulb isn't getting full system voltage (12.6v+). Tech B proves that the missing voltage is being 'dropped' across a bad ground connection (2.5v drop is excessive; should be < 0.1v). A bad ground is causing the dim light."
        },
        {
            question: "When testing a relay, resistance between terminals 85 and 86 measures Infinity (OL). What does this indicate?",
            options: ["The relay coil is shorted to ground", "The relay coil is open", "The switch contacts (30 and 87) are welded closed", "The relay is functioning normally"],
            correct: 1,
            explanation: "Terminals 85 and 86 are the control coil of a standard ISO relay. They should have a measurable resistance (usually 50-100 ohms). An 'OL' or infinity reading means the coil wire inside the relay is broken (open circuit)."
        },
        {
            question: "A vehicle with a CAN-bus network has a 'U-code' set in multiple modules. Technician A says this indicates an emissions failure. Technician B says a U-code indicates a network communication error between modules. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 1,
            explanation: "Technician B is right. OBD-II codes starting with 'U' are Network Communication codes. 'P' is Powertrain (emissions), 'B' is Body, and 'C' is Chassis."
        }
    ],
    A7: [
        {
            question: "Technician A says that R-134a and R-1234yf refrigerants can be mixed in the same system if the capacity is low. Technician B says that PAG oil is hydroscopic and must be kept in a tightly sealed container. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 1,
            explanation: "Technician B is right. PAG oil readily absorbs moisture from the air (hydroscopic/hygroscopic) and must remain sealed. Technician A is wrong; it is illegal and damaging to the system and recovery equipment to mix different refrigerants."
        },
        {
            question: "An A/C system using a Thermal Expansion Valve (TXV) cools poorly. The low-side pressure is very low, and the high-side pressure is also lower than normal. What is the MOST likely cause?",
            options: ["An overcharged system", "A stuck closed TXV", "A failing A/C compressor", "A cooling fan failure"],
            correct: 1,
            explanation: "A stuck closed TXV restricts refrigerant flow into the evaporator, causing the compressor to pull the low side into a deep vacuum (very low pressure) while the high side runs low because there is little refrigerant to compress. A failing compressor would have high low-side and low high-side."
        },
        {
            question: "When the A/C is turned on, the compressor clutch engages, but warm air blows from the vents. The low-side pipe is freezing cold and covered in frost. What is the MOST likely cause?",
            options: ["A restricted cabin air filter", "A bad blend door actuator", "An undercharged system", "Both A and B could be the cause"],
            correct: 3,
            explanation: "Both A and B are correct. If the low side pipe returning to the compressor is freezing, the A/C system is working *too* well, but the cold isn't reaching the cabin. A plugged cabin filter stops airflow across the evaporator. A bad blend door routes air over the heater core instead of the cold evaporator."
        }
    ],
    A8: [
        {
            question: "A vehicle presents with a P0300 (Random/Multiple Cylinder Misfire). Technician A says a massive vacuum leak could cause this. Technician B says low fuel pressure could cause this. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 2,
            explanation: "Both are right. A P0300 means the misfire is not isolated to one cylinder. Both a massive vacuum leak (unmetered air) and low fuel pressure affect the air-fuel ratio of ALL cylinders, causing lean misfires randomly across the engine."
        },
        {
            question: "On a Gasoline Direct Injection (GDI) engine, a technician is replacing fuel injectors. Technician A says the high-pressure fuel lines can be reused if they aren't damaged. Technician B says the Teflon injector seals must be resized using a special tool before installation. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 1,
            explanation: "Technician B is right. GDI Teflon seals expand when removed and must be compressed/resized with special tools to fit into the cylinder head. Technician A is wrong; GDI high-pressure lines are one-time-use torque-to-yield lines and must be replaced to prevent catastrophic fuel leaks."
        },
        {
            question: "An upstream Wideband Air-Fuel (A/F) ratio sensor is being monitored on a scan tool during steady cruising. What should the data look like on a properly running engine?",
            options: ["Oscillating rapidly between 0.1v and 0.9v", "Remaining relatively steady at the stoichiometric target (e.g., 3.3v or 0mA)", "Dropping to 0.0v periodically", "Spiking to 5.0v constantly"],
            correct: 1,
            explanation: "Unlike older narrowband O2 sensors that oscillate wildly between 0.1v and 0.9v, Wideband A/F sensors output a steady signal (either voltage or amperage, depending on the manufacturer) that stays flat at the 14.7:1 target during steady cruise."
        }
    ],
    A9: [
        {
            question: "Technician A says that a restricted Diesel Particulate Filter (DPF) will cause high exhaust backpressure and low engine power. Technician B says an active regeneration injects raw diesel fuel into the exhaust stream to raise temperatures and burn off soot. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 2,
            explanation: "Both are right. A clogged DPF chokes the engine, killing power. Active regeneration involves injecting fuel (either via a '7th injector' in the exhaust or via a late post-injection event in the cylinder) to create a fire in the Diesel Oxidation Catalyst (DOC), raising DPF temps to 1100°F+ to burn off soot."
        },
        {
            question: "What is the primary function of the Selective Catalytic Reduction (SCR) system on a modern diesel engine?",
            options: ["To reduce particulate matter (soot)", "To reduce Oxides of Nitrogen (NOx)", "To lower exhaust gas temperatures", "To recirculate exhaust gas into the intake"],
            correct: 1,
            explanation: "The SCR system uses Diesel Exhaust Fluid (DEF) to cause a chemical reaction that reduces harmful NOx emissions into harmless nitrogen gas and water vapor."
        },
        {
            question: "A High-Pressure Common Rail (HPCR) diesel engine has a hard start condition. A leak-off (return flow) test is performed on the injectors, and Cylinder #3 shows excessive return flow. What does this indicate?",
            options: ["Injector #3 is leaking fuel into the combustion chamber", "Injector #3 has internal mechanical wear and is bleeding off rail pressure", "The high-pressure fuel pump is failing", "The glow plug on Cylinder #3 is bad"],
            correct: 1,
            explanation: "In an HPCR system, the injectors hold back massive pressure (up to 30,000+ psi). If internal valves or tolerances wear out, high-pressure fuel bypasses the nozzle and dumps into the return line. This bleeds off the common rail pressure, making it impossible for the pump to build enough pressure to start the engine."
        }
    ],
    F1: [
        {
            question: "When performing maintenance on a CNG (Compressed Natural Gas) fuel cylinder, Technician A says the cylinder must be visually inspected for damage every 3 years or 36,000 miles. Technician B says CNG cylinders have an indefinite lifespan as long as they aren't damaged. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 0,
            explanation: "Technician A is right. Safety standards require periodic visual inspections. Technician B is wrong; CNG cylinders have a strictly enforced expiration date (typically 15-20 years) stamped on the label, after which they must be destroyed, regardless of condition."
        },
        {
            question: "On a Hybrid Electric Vehicle (HEV), before performing work on the high-voltage system, the technician must do all of the following EXCEPT:",
            options: ["Wear Class 0 high-voltage lineman's gloves with leather protectors", "Remove the high-voltage service disconnect plug", "Wait at least 5-10 minutes for the capacitors to discharge", "Disconnect the 12-volt auxiliary battery before removing the service plug"],
            correct: 3,
            explanation: "You must NOT disconnect the 12-volt battery *before* removing the service plug. In many systems, removing the service plug uses 12v power to open the high-voltage contactors. The correct procedure is: Key off, wear gloves, remove HV disconnect, wait for capacitors to bleed down, THEN verify zero voltage with a meter."
        },
        {
            question: "Technician A says that E85 fuel is highly conductive compared to regular gasoline. Technician B says E85 vehicles require special corrosion-resistant fuel lines and fuel pump components. Who is right?",
            options: ["A only", "B only", "Both A and B", "Neither A nor B"],
            correct: 2,
            explanation: "Both are right. E85 (85% ethanol) contains oxygen and holds moisture, making it highly conductive (which can cause galvanic corrosion of fuel sending units) and highly corrosive to standard rubber, aluminum, and magnesium parts."
        }
    ]
};

// Insert categories
const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)');
for (const [id, name] of Object.entries(categories)) {
    insertCategory.run(id, name);
}

// Insert questions
const insertQuestion = db.prepare(`
    INSERT INTO questions (category_id, question, options, correct, explanation) 
    VALUES (?, ?, ?, ?, ?)
`);

// Clear existing questions to avoid duplicates if run multiple times
db.exec('DELETE FROM questions');

for (const [categoryId, questions] of Object.entries(quizData)) {
    for (const q of questions) {
        insertQuestion.run(
            categoryId,
            q.question,
            JSON.stringify(q.options),
            q.correct,
            q.explanation
        );
    }
}

console.log("Database seeded successfully with massive highly-accurate ASE question bank.");
