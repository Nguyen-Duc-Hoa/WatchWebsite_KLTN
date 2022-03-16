using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Intefaces;

namespace WatchWebsite_TLCN.Repository
{
    public class EnergyRepository : IEnergy
    {
        private readonly MyDBContext _context;

        public EnergyRepository(MyDBContext context)
        {
            _context = context;
        }
        public bool DeleteEnergy(int idEnergy)
        {
            Energy energy = _context.Enegies.Where(x => x.EnergyId == idEnergy).FirstOrDefault();
            if(energy == null)
            {
                return false;
            }
            _context.Enegies.Remove(energy);

            return Save();

        }

        public bool Save()
        {
            return _context.SaveChanges() > 0 ? true : false;
        }
    }
}
