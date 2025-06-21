import { createApp, ref, computed , watch} from "vue";

function getMaxLoanAmount(monthlyPayment, term) {
      const c = 240;
      const rate = mr(term)
      const appraisalFactor = 1.125;
      const denom = appraisalFactor * (rate + (1 / term));
      let loan = (monthlyPayment - c) / denom;
      if(loan>1200000){
          return 1200000
      }
      return loan>0?loan:0
    }
function getMinTerm(loan, monthlyPayment ){
    for (let y = 1; y <= 120; y++) {
        const x = getMaxLoanAmount(monthlyPayment, y);
        if (x > loan) {
          return y
        }
      }
      
        return 120
}
function mr (term){
    switch(true){
        case term<=3:return 0.058352
        case term<=6:return 0.053077
        case term<=18:return 0.052964
        case term<=30:return 0.04426
        case term<=36:return 0.036914
        case term<=48:return 0.028797
        case term<=60:return 0.027485
        case term<=72:return 0.024502
        case term<=96:return 0.025344
        case term<=120:return 0.0235
    }
}
function calculateMonthlyDeduction(loan,term) {
  const afr = 0.125;
  const appraisal = loan * (1 + afr);
  const interest = appraisal * mr(term);
  const monthlyPrincipal = appraisal / term;
  const extraCharges = 240;
  const totalMonthly = interest + monthlyPrincipal + extraCharges;

  return totalMonthly.toFixed(2)
}

    createApp({
      setup() {
        const basicSalary = ref(0);
        const netSalary = ref(0);
        const duration= ref(12)
      
        const loan = ref(0)
        const deduction = computed({
            get:()=>{
            let results=calculateMonthlyDeduction(loan.value, duration.value);
            if(results>ability.value){
                alert("deductions should not be greater than ability")
                return ability.value
            }
            return results 
            },
            set:(val)=>{
                if(parseFloat(val)>ability.value){
                    alert("deductions cannot be greater than ability ")
                    return loan.value = maxLoan.value
                }
                return Number(val)
            }
        });
        const ability= computed(
            ()=>{let results=netSalary.value-basicSalary.value/3;
            return results>0? results:0
            }
        );
        const isEligible = computed(() =>deduction.value<ability.value);
        

        const maxLoan = computed(() => {
          
          return getMaxLoanAmount(ability.value, duration.value)
        });
        const minTerm = computed(()=>getMinTerm(loan.value,ability.value))
       
        watch([loan, ability], ([newLoan, newAbility]) => {
      if (newLoan > getMaxLoanAmount(newAbility, duration.value)) {
        // Loan exceeds max for current duration, find minimum term
        const calculatedMinTerm = getMinTerm(newLoan, newAbility);
        if (calculatedMinTerm !== duration.value) {
          duration.value = calculatedMinTerm;
        }
      }
    }, { immediate: true });

watch(duration, (newDuration) => {
      const currentMax = getMaxLoanAmount(ability.value, newDuration);
      if (loan.value > currentMax) {
        loan.value = currentMax;
      }
    });
        return {
          basicSalary,
          netSalary,
          duration,
          isEligible,
          maxLoan,
          ability,
          deduction,
          minTerm,
          loan
        };
      }
    }).mount('#app');