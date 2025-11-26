<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PeminjamanExport implements FromCollection, WithHeadings, WithStyles, WithEvents
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data->map(function ($p) {
            return [
                $p->id,
                $p->peminjam_id,
                $p->inventory?->nama_barang ?? '-',
                $p->tanggal_pinjam,
                $p->tanggal_kembali,
                $p->keterangan,
                $p->status,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'ID',
            'Peminjam',
            'Barang',
            'Tanggal Pinjam',
            'Tanggal Kembali',
            'Keterangan',
            'Status',
        ];
    }

    /**
     * Styling header & kolom
     */
    public function styles(Worksheet $sheet)
    {
        // Header tebal, rata tengah
        $sheet->getStyle('A1:G1')->getFont()->setBold(true);
        $sheet->getStyle('A1:G1')->getAlignment()->setHorizontal('center');

        // Auto size kolom
        foreach (range('A', 'G') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        return [];
    }

    /**
     * Styling tambahan: border & background header
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastRow = $sheet->getHighestRow();

                // Border untuk semua data
                $sheet->getStyle("A1:G$lastRow")->getBorders()->getAllBorders()
                    ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

                // Header background abu
                $sheet->getStyle("A1:G1")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFD3D3D3');
            },
        ];
    }
}
