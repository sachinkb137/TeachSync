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
      
      // Monday to Friday (8 AM to 6 PM)
      for (const day of weekDays) {
        // Morning sessions (8 AM to 10 AM)
        for (let hour = 8; hour < 10; hour++) {
          hours.push({ day, startTime: `${hour}:00`, endTime: `${hour + 1}:00` });
        }
        // After short break (10:30 AM to 12:30 PM)
        for (let hour = 10.5; hour < 12.5; hour++) {
          hours.push({ 
            day, 
            startTime: `${Math.floor(hour)}:${hour % 1 ? '30' : '00'}`,
            endTime: `${Math.floor(hour + 1)}:${(hour + 1) % 1 ? '30' : '00'}`
          });
        }
        // After lunch break (2 PM to 6 PM)
        for (let hour = 14; hour < 18; hour++) {
          hours.push({ day, startTime: `${hour}:00`, endTime: `${hour + 1}:00` });
        }
      }
  
      // Saturday (8 AM to 12:30 PM)
      for (const day of saturday) {
        for (let hour = 8; hour < 10; hour++) {
          hours.push({ day, startTime: `${hour}:00`, endTime: `${hour + 1}:00` });
        }
        // After short break
        for (let hour = 10.5; hour < 12.5; hour++) {
          hours.push({ 
            day, 
            startTime: `${Math.floor(hour)}:${hour % 1 ? '30' : '00'}`,
            endTime: `${Math.floor(hour + 1)}:${(hour + 1) % 1 ? '30' : '00'}`
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
    
        // First schedule elective subjects (4 PM to 5 PM)
        const electiveSubjects = this.subjects.filter(s => s.subjectType === 'Elective');
        for (const subject of electiveSubjects) {
            const availableSlots = this.workingHours.filter(slot => {
                const [hour] = slot.startTime.split(':').map(Number);
                return hour === 16; // 4 PM
            });
    
            for (let i = 0; i < subject.teachingHoursPerWeek; i++) {
                const slot = this.getRandomElement(availableSlots);
                const teacher = this.getTeacherForSubject(subject._id);
                
                if (slot && teacher) {
                    chromosome.push({
                        ...slot, // Do not include room information here
                        subject: subject._id,
                        teacher: teacher._id,
                        semester: subject.semester
                    });
                    assignedSlots.add(`${slot.day}-${slot.startTime}`);
                }
            }
        }
    
        // Schedule lab sessions (2-hour blocks)
        const labSubjects = this.subjects.filter(s => s.subjectType === 'Lab');
        for (const subject of labSubjects) {
            const remainingHours = subject.teachingHoursPerWeek;
            let hoursScheduled = 0;
    
            while (hoursScheduled < remainingHours) {
                const availableSlots = this.getConsecutiveSlots(2, assignedSlots);
                if (availableSlots.length >= 2) {
                    const teacher = this.getTeacherForSubject(subject._id);
                    if (teacher) {
                        availableSlots.forEach(slot => {
                            chromosome.push({
                                ...slot, // Remove room details
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
    
        // Schedule theory classes
        const theorySubjects = this.subjects.filter(s => s.subjectType === 'Theory');
        for (const subject of theorySubjects) {
            const remainingHours = subject.teachingHoursPerWeek;
            let hoursScheduled = 0;
    
            while (hoursScheduled < remainingHours) {
                const availableSlots = this.workingHours.filter(slot => 
                    !assignedSlots.has(`${slot.day}-${slot.startTime}`));
                
                if (availableSlots.length > 0) {
                    const slot = this.getRandomElement(availableSlots);
                    const teacher = this.getTeacherForSubject(subject._id);
                    
                    if (slot && teacher) {
                        chromosome.push({
                            ...slot, // Again, no room assignment here
                            subject: subject._id,
                            teacher: teacher._id,
                            semester: subject.semester
                        });
                        assignedSlots.add(`${slot.day}-${slot.startTime}`);
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
               hour < 16; // Ensure labs don't overlap with elective hours
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
            // Check teacher clashes
            if (slot1.teacher === slot2.teacher) {
              fitness -= 10;
              teacherClashes.set(
                `${slot1.day}-${slot1.startTime}-${slot1.teacher}`, 
                (teacherClashes.get(
                  `${slot1.day}-${slot1.startTime}-${slot1.teacher}`) || 0) + 1
              );
            }
  
            // Check semester clashes (except for electives)
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
        // Calculate fitness for each chromosome
        const fitnessScores = population.map(chromosome => ({
          chromosome,
          fitness: this.calculateFitness(chromosome)
        }));
  
        // Sort by fitness
        fitnessScores.sort((a, b) => b.fitness - a.fitness);
  
        // Update best solution
        if (fitnessScores[0].fitness > bestFitness) {
          bestFitness = fitnessScores[0].fitness;
          bestSolution = fitnessScores[0].chromosome;
        }
  
        // Early termination if perfect solution found
        if (bestFitness === 100) break;
  
        // Select parents for next generation
        const parents = fitnessScores
          .slice(0, this.populationSize / 2)
          .map(item => item.chromosome);
  
        // Create new population through crossover and mutation
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