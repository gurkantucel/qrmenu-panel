import PatientDiseaseHistoryTable from './health-history/patient-disease-history/PatientDiseaseHistoryTable';
import PatientMedicineHistoryTable from './health-history/patient-medicine-history/PatientMedicineHistoryTable';

export const PatientHealthHistory = ({ params }: { params: { slug: string } }) => {
    return (
        <>
            <PatientDiseaseHistoryTable params={params} />
            <PatientMedicineHistoryTable params={params} />
        </>
    )
}
