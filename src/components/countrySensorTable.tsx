import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface DataTableProps {
  data: Array<{ [key: string]: any }>;
}

const DataTable: React.FC<DataTableProps & { loading: boolean; countryName: string }> = ({ data, loading, countryName }) => {
    return (
        <TableContainer component={Paper}>
            <h2 style={{ textAlign: 'center' }}>{countryName}'s Sensor Types</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Stat Measured</TableCell>
                            <TableCell align="center">Units</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row: { [key: string]: any }, index: number) => {
                            const { name, units } = row;
                            return (
                                <TableRow key={index}>
                                    <TableCell align="center">{name}</TableCell>
                                    <TableCell align="center">{units}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};

export default DataTable;
