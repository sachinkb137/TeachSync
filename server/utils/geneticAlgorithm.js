class TimeTableGeneticAlgorithm {
    constructor(subjects, teachers, assignments) {
        this.subjects = subjects;
        this.teachers = teachers;
        this.assignments = assignments;
        this.populationSize = 100;
        this.generations = 1000;
        this.mutationRate = 0.1;
        this.workingHours = this.generateWorkingHours();
    }

    generateWorkingHours() {
        const hours = [];
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const saturday = ['Saturday'];

        // Define break periods
        const breaks = [
            { startTime: '10:00', endTime: '10:30' }, // Morning break
            { startTime: '12:30', endTime: '14:00' }  // Lunch break
        ];

        const isBreakTime = (startTime, endTime) => {
            return breaks.some(breakSlot =>
                (startTime >= breakSlot.startTime && startTime < breakSlot.endTime) ||
                (endTime > breakSlot.startTime && endTime <= breakSlot.endTime)
            );
        };

        for (const day of weekDays) {
            for (let hour = 8; hour < 10; hour++) {
                const startTime = `${hour}:00`;
                const endTime = `${hour + 1}:00`;
                if (!isBreakTime(startTime, endTime)) {
                    hours.push({ day, startTime, endTime });
                }
            }
            for (let hour = 10.5; hour < 12.5; hour++) {
                const startTime = `${Math.floor(hour)}:${hour % 1 ? '30' : '00'}`;
                const endTime = `${Math.floor(hour + 1)}:${(hour + 1) % 1 ? '30' : '00'}`;
                if (!isBreakTime(startTime, endTime)) {
                    hours.push({ day, startTime, endTime });
                }
            }
            for (let hour = 14; hour < 18; hour++) {
                const startTime = `${hour}:00`;
                const endTime = `${hour + 1}:00`;
                if (!isBreakTime(startTime, endTime)) {
                    hours.push({ day, startTime, endTime });
                }
            }
        }

        for (const day of saturday) {
            for (let hour = 8; hour < 10; hour++) {
                const startTime = `${hour}:00`;
                const endTime = `${hour + 1}:00`;
                if (!isBreakTime(startTime, endTime)) {
                    hours.push({ day, startTime, endTime });
                }
            }
            for (let hour = 10.5; hour < 12.5; hour++) {
                const startTime = `${Math.floor(hour)}:${hour % 1 ? '30' : '00'}`;
                const endTime = `${Math.floor(hour + 1)}:${(hour + 1) % 1 ? '30' : '00'}`;
                if (!isBreakTime(startTime, endTime)) {
                    hours.push({ day, startTime, endTime });
                }
            }
        }

        return hours;
    }

    generateInitialPopulation() {
        const population = [];
        for (let i = 0; i < this.populationSize; i++) {
            const chromosome = this.createRandomChromosome();
            population.push(chromosome);
        }
        return population;
    }

    createRandomChromosome() {
        const chromosome = [];
        const assignedSlots = new Set();
        const subjectDayCount = new Map();

        // Elective Subjects Allocation
        const electiveSubjects = this.subjects.filter(s => s.subjectType === 'Elective');
        for (const subject of electiveSubjects) {
            const availableSlots = this.workingHours.filter(slot => {
                const [hour] = slot.startTime.split(':').map(Number);
                return hour === 16; // Example: Only considering 4 PM slots for electives
            });

            for (let i = 0; i < subject.teachingHoursPerWeek; i++) {
                const slot = this.getRandomElement(availableSlots);
                const teacher = this.getTeacherForSubject(subject._id);

                if (slot && teacher) {
                    chromosome.push({
                        ...slot,
                        subject: subject._id,
                        teacher: teacher._id,
                        semester: subject.semester
                    });
                    assignedSlots.add(`${slot.day}-${slot.startTime}`);
                }
            }
        }

        // Lab Subjects Allocation (Consecutive slots, no breaks between them)
        const labSubjects = this.subjects.filter(s => s.subjectType === 'Lab');
        for (const subject of labSubjects) {
            let hoursScheduled = 0;

            while (hoursScheduled < subject.teachingHoursPerWeek) {
                // Find consecutive slots that don't have a break between them
                const availableSlots = this.getConsecutiveSlots(2, assignedSlots, true);
                if (availableSlots.length >= 2) {
                    const teacher = this.getTeacherForSubject(subject._id);
                    if (teacher) {
                        availableSlots.forEach(slot => {
                            chromosome.push({
                                ...slot,
                                subject: subject._id,
                                teacher: teacher._id,
                                semester: subject.semester
                            });
                            assignedSlots.add(`${slot.day}-${slot.startTime}`);
                        });
                        hoursScheduled += 2;
                    }
                }
            }
        }

        // Theory Subjects Allocation
        const theorySubjects = this.subjects.filter(s => s.subjectType === 'Theory');
        for (const subject of theorySubjects) {
            let hoursScheduled = 0;

            while (hoursScheduled < subject.teachingHoursPerWeek) {
                const availableSlots = this.workingHours.filter(slot =>
                    !assignedSlots.has(`${slot.day}-${slot.startTime}`));

                const daySlots = availableSlots.filter(slot => {
                    const dayKey = `${slot.day}-${subject._id}`;
                    const count = subjectDayCount.get(dayKey) || 0;
                    return count === 0;
                });

                if (daySlots.length > 0) {
                    const slot = this.getRandomElement(daySlots);
                    const teacher = this.getTeacherForSubject(subject._id);

                    if (slot && teacher) {
                        chromosome.push({
                            ...slot,
                            subject: subject._id,
                            teacher: teacher._id,
                            semester: subject.semester
                        });
                        assignedSlots.add(`${slot.day}-${slot.startTime}`);
                        const dayKey = `${slot.day}-${subject._id}`;
                        subjectDayCount.set(dayKey, 1);
                        hoursScheduled++;
                    }
                }
            }
        }

        return chromosome;
    }

    getConsecutiveSlots(count, assignedSlots, noBreaks = false) {
        const availableSlots = this.workingHours.filter(slot => {
            const [hour] = slot.startTime.split(':').map(Number);
            return !assignedSlots.has(`${slot.day}-${slot.startTime}`) &&
                   hour < 16; // Filtering out slots after 4 PM
        });

        const consecutiveSlots = [];
        for (let i = 0; i < availableSlots.length - count + 1; i++) {
            const current = availableSlots[i];
            const next = availableSlots[i + 1];

            // Ensure consecutive slots are in the same day
            if (current.day === next.day) {
                const currentHour = parseInt(current.startTime.split(':')[0]);
                const nextHour = parseInt(next.startTime.split(':')[0]);

                // Check if the slots are consecutive and respect the break rule
                if (nextHour - currentHour === 1) {
                    if (noBreaks) {
                        // Ensure there is no break between the consecutive slots
                        const currentSlotEndTime = `${currentHour + 1}:00`;
                        const nextSlotStartTime = `${nextHour}:00`;

                        if (!this.isBreakTime(currentSlotEndTime, nextSlotStartTime)) {
                            consecutiveSlots.push([current, next]);
                        }
                    } else {
                        consecutiveSlots.push([current, next]);
                    }
                }
            }
        }

        return consecutiveSlots.length > 0 ?
            this.getRandomElement(consecutiveSlots) : [];
    }

    getTeacherForSubject(subjectId) {
        const assignment = this.assignments.find(a =>
            a.subjectId.includes(subjectId));
        return assignment ?
            this.getRandomElement(assignment.teacherId) : null;
    }

    isBreakTime(startTime, endTime) {
        const breaks = [
            { startTime: '10:00', endTime: '10:30' },
            { startTime: '12:30', endTime: '14:00' }
        ];
        return breaks.some(breakSlot =>
            (startTime >= breakSlot.startTime && startTime < breakSlot.endTime) ||
            (endTime > breakSlot.startTime && endTime <= breakSlot.endTime)
        );
    }

    crossover(parent1, parent2) {
        const crossoverPoint = Math.floor(Math.random() * parent1.length);
        const child1 = [...parent1.slice(0, crossoverPoint),
            ...parent2.slice(crossoverPoint)];
        const child2 = [...parent2.slice(0, crossoverPoint),
            ...parent1.slice(crossoverPoint)];
        return [child1, child2];
    }

    mutate(chromosome) {
        if (Math.random() < this.mutationRate) {
            const idx1 = Math.floor(Math.random() * chromosome.length);
            const idx2 = Math.floor(Math.random() * chromosome.length);

            [chromosome[idx1], chromosome[idx2]] =
                [chromosome[idx2], chromosome[idx1]];
        }
        return chromosome;
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    calculateFitness(chromosome) {
        let fitness = 0;
        const assignedSlots = new Set();
    
        const subjectCounts = new Map(); // Count how many times each subject is scheduled
        const teacherSchedules = new Map(); // Track teacher schedules to ensure no double booking
    
        // Iterate over all slots in the chromosome
        for (const slot of chromosome) {
            const { day, startTime, subject, teacher } = slot;
    
            // Ensure no double-booking of slots (same day and start time)
            if (assignedSlots.has(`${day}-${startTime}`)) {
                fitness -= 50; // Penalty for double-booking
            } else {
                assignedSlots.add(`${day}-${startTime}`);
            }
    
            // Track subject counts to ensure correct teaching hours per week
            if (!subjectCounts.has(subject)) {
                subjectCounts.set(subject, 0);
            }
            subjectCounts.set(subject, subjectCounts.get(subject) + 1);
    
            // Track teacher schedules to avoid double-booking teachers
            if (!teacherSchedules.has(teacher)) {
                teacherSchedules.set(teacher, new Set());
            }
            if (teacherSchedules.get(teacher).has(`${day}-${startTime}`)) {
                fitness -= 50; // Penalty for double-booking a teacher
            } else {
                teacherSchedules.get(teacher).add(`${day}-${startTime}`);
            }
        }
    
        // Add points for each subject being scheduled the correct number of hours
        for (const subject of this.subjects) {
            if (subjectCounts.has(subject._id) && subjectCounts.get(subject._id) === subject.teachingHoursPerWeek) {
                fitness += 100; // Reward for correct teaching hours
            } else {
                fitness -= 10; // Penalty for insufficient or excessive teaching hours
            }
        }
    
        // Add penalty if there are any subjects that are not scheduled at all
        for (const subject of this.subjects) {
            if (!subjectCounts.has(subject._id)) {
                fitness -= 100; // Penalty for unscheduled subjects
            }
        }
    
        // Optionally, add logic to penalize break violations, consecutive lab slot violations, etc.
        // For example:
        const breaks = [
            { startTime: '10:00', endTime: '10:30' },
            { startTime: '12:30', endTime: '14:00' }
        ];
    
        for (const breakSlot of breaks) {
            const { startTime, endTime } = breakSlot;
            // Penalize if any class is scheduled during a break
            for (const slot of chromosome) {
                if (slot.startTime >= startTime && slot.startTime < endTime) {
                    fitness -= 30; // Penalty for scheduling during break
                }
            }
        }
    
        return fitness;
    }
    
    evolve() {
        let population = this.generateInitialPopulation();
        let bestSolution = null;
        let bestFitness = -1;

        for (let generation = 0; generation < this.generations; generation++) {
            const fitnessScores = population.map(chromosome => ({
                chromosome,
                fitness: this.calculateFitness(chromosome)
            }));

            fitnessScores.sort((a, b) => b.fitness - a.fitness);

            if (fitnessScores[0].fitness > bestFitness) {
                bestFitness = fitnessScores[0].fitness;
                bestSolution = fitnessScores[0].chromosome;
            }

            if (bestFitness === 100) break;

            const parents = fitnessScores
                .slice(0, this.populationSize / 2)
                .map(item => item.chromosome);

            const newPopulation = [];
            while (newPopulation.length < this.populationSize) {
                const parent1 = this.getRandomElement(parents);
                const parent2 = this.getRandomElement(parents);
                let [child1, child2] = this.crossover(parent1, parent2);
                child1 = this.mutate(child1);
                child2 = this.mutate(child2);
                newPopulation.push(child1, child2);
            }

            population = newPopulation;
        }

        return bestSolution;
    }
}

module.exports = TimeTableGeneticAlgorithm;
