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

        for (const day of weekDays) {
            for (let hour = 8; hour < 10; hour++) {
                hours.push({ day, startTime: `${hour}:00`, endTime: `${hour + 1}:00` });
            }
            for (let hour = 10.5; hour < 12.5; hour++) {
                hours.push({ 
                    day, 
                    startTime: `${Math.floor(hour)}:${hour % 1 ? '30' : '00'}`,
                    endTime: `${Math.floor(hour + 1)}:${(hour + 1) % 1 ? '30' : '00'}`,
                });
            }
            for (let hour = 14; hour < 18; hour++) {
                hours.push({ day, startTime: `${hour}:00`, endTime: `${hour + 1}:00` });
            }
        }

        for (const day of saturday) {
            for (let hour = 8; hour < 10; hour++) {
                hours.push({ day, startTime: `${hour}:00`, endTime: `${hour + 1}:00` });
            }
            for (let hour = 10.5; hour < 12.5; hour++) {
                hours.push({ 
                    day, 
                    startTime: `${Math.floor(hour)}:${hour % 1 ? '30' : '00'}`,
                    endTime: `${Math.floor(hour + 1)}:${(hour + 1) % 1 ? '30' : '00'}`,
                });
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

        const electiveSubjects = this.subjects.filter(s => s.subjectType === 'Elective');
        for (const subject of electiveSubjects) {
            const availableSlots = this.workingHours.filter(slot => {
                const [hour] = slot.startTime.split(':').map(Number);
                return hour === 16;
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

        const labSubjects = this.subjects.filter(s => s.subjectType === 'Lab');
        for (const subject of labSubjects) {
            let hoursScheduled = 0;

            while (hoursScheduled < subject.teachingHoursPerWeek) {
                const availableSlots = this.getConsecutiveSlots(2, assignedSlots);
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

    getConsecutiveSlots(count, assignedSlots) {
        const availableSlots = this.workingHours.filter(slot => {
            const [hour] = slot.startTime.split(':').map(Number);
            return !assignedSlots.has(`${slot.day}-${slot.startTime}`) &&
                   hour < 16;
        });

        const consecutiveSlots = [];
        for (let i = 0; i < availableSlots.length - count + 1; i++) {
            const current = availableSlots[i];
            const next = availableSlots[i + 1];

            if (current.day === next.day) {
                const currentHour = parseInt(current.startTime.split(':')[0]);
                const nextHour = parseInt(next.startTime.split(':')[0]);

                if (nextHour - currentHour === 1) {
                    consecutiveSlots.push([current, next]);
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

    calculateFitness(chromosome) {
        let fitness = 100;
        const teacherClashes = new Map();
        const semesterClashes = new Map();

        chromosome.forEach((slot1, i) => {
            chromosome.forEach((slot2, j) => {
                if (i !== j && slot1.day === slot2.day && 
                    slot1.startTime === slot2.startTime) {
                    if (slot1.teacher === slot2.teacher) {
                        fitness -= 10;
                        teacherClashes.set(
                            `${slot1.day}-${slot1.startTime}-${slot1.teacher}`, 
                            (teacherClashes.get(
                                `${slot1.day}-${slot1.startTime}-${slot1.teacher}`) || 0) + 1
                        );
                    }

                    if (slot1.semester === slot2.semester) {
                        const subject1 = this.subjects.find(s => s._id === slot1.subject);
                        const subject2 = this.subjects.find(s => s._id === slot2.subject);

                        if (subject1.subjectType !== 'Elective' || 
                            subject2.subjectType !== 'Elective') {
                            fitness -= 10;
                            semesterClashes.set(
                                `${slot1.day}-${slot1.startTime}-${slot1.semester}`,
                                (semesterClashes.get(
                                    `${slot1.day}-${slot1.startTime}-${slot1.semester}`) || 0) + 1
                            );
                        }
                    }
                }
            });
        });

        return Math.max(0, fitness);
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