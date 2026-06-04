/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const path = require('path');

const adapter = new PrismaLibSql({
  url: `file:${path.join(__dirname, 'dev.db')}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear tables
  try {
    await prisma.payment.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.portfolioItem.deleteMany();
    await prisma.package.deleteMany();
    await prisma.service.deleteMany();
    await prisma.user.deleteMany();
    await prisma.setting.deleteMany();
  } catch (err) {
    console.log("Error clearing tables, continuing...", err);
  }

  // Create Users
  await prisma.user.create({
    data: {
      email: 'admin@framecreative.com',
      name: 'Admin Frame Creative',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'client@example.com',
      name: 'Budi Santoso',
      role: 'CLIENT',
    },
  });

  // Create Services
  const services = [
    { name: 'Photobooth Event', description: 'Interactive open-air photobooth experience for any party or celebration.', benefits: 'Unlimited prints,Custom layouts,Instant sharing,Fun props', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL3cHaiX10lRvPF-DA-PVqERSSJaCqEdq-JPjyQgnskVVlhn7tsujMfKpfWr39ViiXA_lbZ38okjwoMxh265TEG8eU_TMadOz97s4m-izAiQqS87VRHpeVZQeZ_qWNP3ffIn5-4T7sPYm7mJKMfoB7ETW2OGAoFq0o3Z-J1WtS03kzPBxwGC9VJA5LvUkbw_EQAb8j0BzzcsbRtcshVnkDjIWIwmq11fs515IfeRmFRb1X07ywYI1JS-M4On83VbeKAE21sc2lf3w' },
    { name: 'Wedding Photobooth', description: 'Premium romantic themed photo station dedicated to capture beautiful memories on your big day.', benefits: 'Exclusive backdrops,VIP thematic props,Premium print quality,Attendant assistants', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXRfTJLI5MZnte5XjK8Es16MCoqDCE0t2wqlX9z1G_ic_AGc83s9aW6Jec-lqhJIoHHUK-4uYAomywOVG_-vByuMu9f9zVb9RGuqHKEPSP8MLO4OuejNaqQ9PNtNF4YigqoPwTXzp_weBhwXPViVVigWRUD3zqvOWQrQPUyiHFZ8FQec9d0hRR4j2RNUI2PcxTVgShV7Zxt4Ew5fl0dtKbm-gM0irLpP_AokgntiEn26Jmz964l-_Z_f57BYGI3expDVqRux_EHQ0' },
    { name: 'Photography', description: 'Studio-grade event photography, capturing high-res highlights and candid emotions.', benefits: 'DSLR cameras,Edited high-res files,Online gallery access,Experienced photographers', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL3cHaiX10lRvPF-DA-PVqERSSJaCqEdq-JPjyQgnskVVlhn7tsujMfKpfWr39ViiXA_lbZ38okjwoMxh265TEG8eU_TMadOz97s4m-izAiQqS87VRHpeVZQeZ_qWNP3ffIn5-4T7sPYm7mJKMfoB7ETW2OGAoFq0o3Z-J1WtS03kzPBxwGC9VJA5LvUkbw_EQAb8j0BzzcsbRtcshVnkDjIWIwmq11fs515IfeRmFRb1X07ywYI1JS-M4On83VbeKAE21sc2lf3w' },
    { name: 'Videography', description: 'Cinematic documentation and event coverage reels that capture the atmosphere of your event.', benefits: '4K cameras,Professional editing,Music licensing,Highlight video', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcWUwJiULqzaOgAwotOtra9DWv1zBQLMDWJPJycv7F5TvgM8HZ3HkLtjVRW5fgjE75dm-sbe9aodgMZ5HikwdYLlkU2h2jdCfbL09TQPDoJAfBamEB6pKoPVva_v5k6ZJNwuoVK3SL5i5-_ISL1yPX_6KIUDzkD_HAhR52SdPV5xC6oqQBrLGKnagEkG82ua7eYHSkI87md96OTIXJa5c6mbtGHSkvDAesP4ulOAtfzqiCBVo-9jvfl-tE4H7wm9j27j8_3GKCntc' },
    { name: 'Live Streaming', description: 'Seamless multi-camera live streaming and broadcast setup for remote participants.', benefits: 'Multi-cam setup,Clean audio,Custom overlays,Zoom/YT broadcast', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcWUwJiULqzaOgAwotOtra9DWv1zBQLMDWJPJycv7F5TvgM8HZ3HkLtjVRW5fgjE75dm-sbe9aodgMZ5HikwdYLlkU2h2jdCfbL09TQPDoJAfBamEB6pKoPVva_v5k6ZJNwuoVK3SL5i5-_ISL1yPX_6KIUDzkD_HAhR52SdPV5xC6oqQBrLGKnagEkG82ua7eYHSkI87md96OTIXJa5c6mbtGHSkvDAesP4ulOAtfzqiCBVo-9jvfl-tE4H7wm9j27j8_3GKCntc' },
    { name: 'VJ Visual', description: 'Dynamic visual mixing and TV display setups for high-energy corporate and musical stages.', benefits: 'Custom loop motions,LED visual layout,Live visual effect mixing,High compatibility', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuV-f6mZmr53G0VbFsNTUkxt2ClQZV_TsvflnYQiuMzhMFdWrm3FCVLhIGfRiLKr9A1Crx-l54RePDAwMez-w1j7xpR8Dy0xWQzUMmKODE2ydS9E52pMzJOaSELbNZme2HPobbK5ztndP0ELINPBLyR48KnMWXrOwV2h3uga2q_GxXoq0O7ikgti9RDEdhGtj7ayE4uRUywQF9Pq9GrlLf3QbvLotcSP4M9jptEkLKfdNUz_gMtynOc3yjIpZmFD-7RK4IfKhFkrg' }
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  // Create Packages
  const packages = [
    { serviceName: 'Photobooth Event', name: 'Basic', price: 1500000, duration: '2 Jam', description: 'Perfect for intimate gatherings and small parties.', features: 'Unlimited 4R Prints,Standard Backdrop,Basic Props Set,1 Professional Attendant,Softcopy via Google Drive' },
    { serviceName: 'Photobooth Event', name: 'Premium', price: 2500000, duration: '4 Jam', description: 'Our most popular package for weddings and corporate events.', features: 'Unlimited 4R Prints,Premium Sequin/Custom Backdrop,Thematic Premium Props,2 Professional Attendants,Custom Photo Template Design,Softcopy via Flashdisk & Drive' },
    { serviceName: 'Photobooth Event', name: 'Exclusive', price: 4000000, duration: 'Hari Penuh (Hingga 8 Jam)', description: 'Comprehensive coverage for grand celebrations.', features: 'Unlimited 4R & Strip Prints,Custom Printed Backdrop (Yours to keep),VIP Thematic Props Set,3 Professional Attendants,Animated GIF Creation,Live Slideshow on External TV,Premium Flashdisk & Online Gallery' },
    
    { serviceName: 'Wedding Photobooth', name: 'Basic', price: 2000000, duration: '2 Jam', description: 'Standard wedding setup.', features: 'Unlimited 4R Prints,Rustic Backdrop,Standard Props,1 Attendant' },
    { serviceName: 'Wedding Photobooth', name: 'Premium', price: 3000000, duration: '4 Jam', description: 'Best choice for standard receptions.', features: 'Unlimited Prints,Custom Flower Backdrop,Thematic VIP Props,2 Attendants,Custom Photo Template' },
    { serviceName: 'Wedding Photobooth', name: 'Exclusive', price: 4500000, duration: '8 Jam', description: 'Ultimate wedding package.', features: 'Unlimited Prints,Printed Custom Backdrop,Premium Props,3 Attendants,Live Slideshow TV,Same-Day USB' },

    { serviceName: 'Photography', name: 'Basic', price: 1000000, duration: '3 Jam', description: 'Simple photo coverage.', features: '1 Photographer,50 Edited Photos,Google Drive share' },
    { serviceName: 'Photography', name: 'Premium', price: 2000000, duration: '6 Jam', description: 'Half day photo coverage.', features: '1 Photographer,1 Assistant,150 Edited Photos,USB Flashdrive' },
    { serviceName: 'Photography', name: 'Exclusive', price: 3500000, duration: '12 Jam', description: 'Full day coverage with photo book.', features: '2 Photographers,300 Edited Photos,Premium Photo Album,Online Gallery Link' },

    { serviceName: 'Videography', name: 'Basic', price: 1500000, duration: '3 Jam', description: 'Short highlight video.', features: '1 Videographer,1 Minute Social Reel' },
    { serviceName: 'Videography', name: 'Premium', price: 3000000, duration: '6 Jam', description: 'Half day video coverage.', features: '1 Videographer,1 Assistant,3 Minute Cinematic Highlight Video' },
    { serviceName: 'Videography', name: 'Exclusive', price: 5000000, duration: '12 Jam', description: 'Full day video with documentary reel.', features: '2 Videographers,5 Minute Cinematic Highlight,Full Documentary Video (15-20 Min)' },

    { serviceName: 'Live Streaming', name: 'Basic', price: 2500000, duration: '3 Jam', description: 'Single camera setup.', features: '1 Static Camera,Clean Audio Mixer Input,YouTube private link' },
    { serviceName: 'Live Streaming', name: 'Premium', price: 5000000, duration: '6 Jam', description: 'Multi-camera standard setup.', features: '2 Cameras,Live Switcher,Custom Graphical Overlays,YouTube/Zoom broadcast' },
    { serviceName: 'Live Streaming', name: 'Exclusive', price: 8000000, duration: '12 Jam', description: 'Complete broadcast production.', features: '3 Cameras,Wireless Video Transmitter,Pre-production standby,Multi-platform broadcasting' },

    { serviceName: 'VJ Visual', name: 'Basic', price: 2000000, duration: '3 Jam', description: 'Basic loop playing.', features: '1 VJ Visual Director,Standard Motion Loops library' },
    { serviceName: 'VJ Visual', name: 'Premium', price: 4000000, duration: '6 Jam', description: 'Themed motion graphics.', features: '1 VJ Visual Director,1 Assistant,Custom Loops with client logo,Live visual mix effects' },
    { serviceName: 'VJ Visual', name: 'Exclusive', price: 7000000, duration: '12 Jam', description: 'Grand stage audio-visual synchronization.', features: '2 VJ Directors,Live Camera visual feed mixing,Exclusive 3D motion animations' }
  ];

  for (const p of packages) {
    await prisma.package.create({ data: p });
  }

  // Create Portfolio Items
  const portfolioItems = [
    { category: 'Wedding', title: 'Elegant Outdoor Wedding', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXRfTJLI5MZnte5XjK8Es16MCoqDCE0t2wqlX9z1G_ic_AGc83s9aW6Jec-lqhJIoHHUK-4uYAomywOVG_-vByuMu9f9zVb9RGuqHKEPSP8MLO4OuejNaqQ9PNtNF4YigqoPwTXzp_weBhwXPViVVigWRUD3zqvOWQrQPUyiHFZ8FQec9d0hRR4j2RNUI2PcxTVgShV7Zxt4Ew5fl0dtKbm-gM0irLpP_AokgntiEn26Jmz964l-_Z_f57BYGI3expDVqRux_EHQ0' },
    { category: 'Corporate', title: 'Tech Summit 2024', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcWUwJiULqzaOgAwotOtra9DWv1zBQLMDWJPJycv7F5TvgM8HZ3HkLtjVRW5fgjE75dm-sbe9aodgMZ5HikwdYLlkU2h2jdCfbL09TQPDoJAfBamEB6pKoPVva_v5k6ZJNwuoVK3SL5i5-_ISL1yPX_6KIUDzkD_HAhR52SdPV5xC6oqQBrLGKnagEkG82ua7eYHSkI87md96OTIXJa5c6mbtGHSkvDAesP4ulOAtfzqiCBVo-9jvfl-tE4H7wm9j27j8_3GKCntc' },
    { category: 'Wedding', title: 'Luxury Reception Photobooth', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL3cHaiX10lRvPF-DA-PVqERSSJaCqEdq-JPjyQgnskVVlhn7tsujMfKpfWr39ViiXA_lbZ38okjwoMxh265TEG8eU_TMadOz97s4m-izAiQqS87VRHpeVZQeZ_qWNP3ffIn5-4T7sPYm7mJKMfoB7ETW2OGAoFq0o3Z-J1WtS03kzPBxwGC9VJA5LvUkbw_EQAb8j0BzzcsbRtcshVnkDjIWIwmq11fs515IfeRmFRb1X07ywYI1JS-M4On83VbeKAE21sc2lf3w' },
    { category: 'Wisuda', title: 'University Graduation Night', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXRfTJLI5MZnte5XjK8Es16MCoqDCE0t2wqlX9z1G_ic_AGc83s9aW6Jec-lqhJIoHHUK-4uYAomywOVG_-vByuMu9f9zVb9RGuqHKEPSP8MLO4OuejNaqQ9PNtNF4YigqoPwTXzp_weBhwXPViVVigWRUD3zqvOWQrQPUyiHFZ8FQec9d0hRR4j2RNUI2PcxTVgShV7Zxt4Ew5fl0dtKbm-gM0irLpP_AokgntiEn26Jmz964l-_Z_f57BYGI3expDVqRux_EHQ0' },
    { category: 'Gathering', title: 'Annual Gala Hybrid Event', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcWUwJiULqzaOgAwotOtra9DWv1zBQLMDWJPJycv7F5TvgM8HZ3HkLtjVRW5fgjE75dm-sbe9aodgMZ5HikwdYLlkU2h2jdCfbL09TQPDoJAfBamEB6pKoPVva_v5k6ZJNwuoVK3SL5i5-_ISL1yPX_6KIUDzkD_HAhR52SdPV5xC6oqQBrLGKnagEkG82ua7eYHSkI87md96OTIXJa5c6mbtGHSkvDAesP4ulOAtfzqiCBVo-9jvfl-tE4H7wm9j27j8_3GKCntc' },
    { category: 'Seminar', title: 'National Marketing Seminar', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL3cHaiX10lRvPF-DA-PVqERSSJaCqEdq-JPjyQgnskVVlhn7tsujMfKpfWr39ViiXA_lbZ38okjwoMxh265TEG8eU_TMadOz97s4m-izAiQqS87VRHpeVZQeZ_qWNP3ffIn5-4T7sPYm7mJKMfoB7ETW2OGAoFq0o3Z-J1WtS03kzPBxwGC9VJA5LvUkbw_EQAb8j0BzzcsbRtcshVnkDjIWIwmq11fs515IfeRmFRb1X07ywYI1JS-M4On83VbeKAE21sc2lf3w' }
  ];

  for (const p of portfolioItems) {
    await prisma.portfolioItem.create({ data: p });
  }

  // Create Testimonials
  const testimonials = [
    { clientName: 'Rian & Dita', eventType: 'Wedding Reception', rating: 5, comment: 'Photobooth-nya super rame! Cetakannya cepet dan kualitas fotonya bener-bener kaya foto studio. Sangat recommended!', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXRfTJLI5MZnte5XjK8Es16MCoqDCE0t2wqlX9z1G_ic_AGc83s9aW6Jec-lqhJIoHHUK-4uYAomywOVG_-vByuMu9f9zVb9RGuqHKEPSP8MLO4OuejNaqQ9PNtNF4YigqoPwTXzp_weBhwXPViVVigWRUD3zqvOWQrQPUyiHFZ8FQec9d0hRR4j2RNUI2PcxTVgShV7Zxt4Ew5fl0dtKbm-gM0irLpP_AokgntiEn26Jmz964l-_Z_f57BYGI3expDVqRux_EHQ0' },
    { clientName: 'PT Maju Jaya', eventType: 'Annual Corporate Gathering', rating: 5, comment: 'Live streaming-nya berjalan tanpa lag sedikit pun. VJ Visual di panggung juga dapet pujian dari direksi. Kerja bagus!', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcWUwJiULqzaOgAwotOtra9DWv1zBQLMDWJPJycv7F5TvgM8HZ3HkLtjVRW5fgjE75dm-sbe9aodgMZ5HikwdYLlkU2h2jdCfbL09TQPDoJAfBamEB6pKoPVva_v5k6ZJNwuoVK3SL5i5-_ISL1yPX_6KIUDzkD_HAhR52SdPV5xC6oqQBrLGKnagEkG82ua7eYHSkI87md96OTIXJa5c6mbtGHSkvDAesP4ulOAtfzqiCBVo-9jvfl-tE4H7wm9j27j8_3GKCntc' },
    { clientName: 'Universitas Indonesia', eventType: 'Graduation Gala Night', rating: 5, comment: 'Sudah 3 tahun berturut-turut pakai Frame Creative untuk VJ dan Photobooth. Selalu memuaskan dan profesional.', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL3cHaiX10lRvPF-DA-PVqERSSJaCqEdq-JPjyQgnskVVlhn7tsujMfKpfWr39ViiXA_lbZ38okjwoMxh265TEG8eU_TMadOz97s4m-izAiQqS87VRHpeVZQeZ_qWNP3ffIn5-4T7sPYm7mJKMfoB7ETW2OGAoFq0o3Z-J1WtS03kzPBxwGC9VJA5LvUkbw_EQAb8j0BzzcsbRtcshVnkDjIWIwmq11fs515IfeRmFRb1X07ywYI1JS-M4On83VbeKAE21sc2lf3w' }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // Create Settings
  const settings = [
    { key: "whatsapp_number", value: "6287784728972" },
    { key: "bank_transfer_va", value: "8802-0877-8472-8972" },
    { key: "bank_transfer_info", value: "Nomor Rekening: 123-4567-890 (BCA a/n Frame Creative)" },
    { key: "bank_transfer_instruction", value: "Kirim transfer ke nomor rekening resmi kami:" },
    { key: "qris_name", value: "FRAME CREATIVE QRIS" },
    { key: "terms_conditions", value: "Syarat & Ketentuan: 1. Jadwal dianggap sah/terkunci hanya setelah pembayaran DP 50% berhasil diverifikasi. 2. Sisa pelunasan wajib diselesaikan paling lambat 3 hari sebelum acara dimulai. 3. Pembatalan dalam kurun waktu kurang dari 7 hari sebelum acara dikenakan denda hangus uang muka." }
  ];

  for (const s of settings) {
    await prisma.setting.create({ data: s });
  }

  console.log('Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
