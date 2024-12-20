import PatientDiseaseHistoryTable from './health-history/patient-disease-history/PatientDiseaseHistoryTable';
import PatientFamilyDiseaseHistoryTable from './health-history/patient-family-disease-history/PatientFamilyDiseaseHistoryTable';
import PatientInjectionHistoryTable from './health-history/patient-injection-history/PatientInjectionHistoryTable';
import PatientMedicineHistoryTable from './health-history/patient-medicine-history/PatientMedicineHistoryTable';
import PatientSurgeryHistoryTable from './health-history/patient-surgery-history/PatientSurgeryHistoryTable';
import PatientTreatmentHistoryTable from './health-history/patient-treatment-history/PatientTreatmentHistoryTable';

export const PatientHealthHistory = ({ params }: { params: { slug: string } }) => {
    return (
        <>
            <PatientDiseaseHistoryTable params={params} />
            <PatientMedicineHistoryTable params={params} />
            <PatientFamilyDiseaseHistoryTable params={params} />
            <PatientSurgeryHistoryTable params={params} />
            <PatientTreatmentHistoryTable params={params} />
            <PatientInjectionHistoryTable params={params} />
        </>
    )
}
