import PatientDiseaseHistoryTable from './health-history/patient-disease-history/PatientDiseaseHistoryTable';
import PatientFamilyDiseaseHistoryTable from './health-history/patient-family-disease-history/PatientFamilyDiseaseHistoryTable';
import PatientMedicineHistoryTable from './health-history/patient-medicine-history/PatientMedicineHistoryTable';

export const PatientHealthHistory = ({ params }: { params: { slug: string } }) => {
    return (
        <>
            <PatientDiseaseHistoryTable params={params} />
            <PatientMedicineHistoryTable params={params} />
            <PatientFamilyDiseaseHistoryTable params={params} />
        </>
    )
}
