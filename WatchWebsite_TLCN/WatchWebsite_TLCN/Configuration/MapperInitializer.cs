using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Entities;

namespace WatchWebsite_TLCN.Configuration
{
    public class MapperInitializer : Profile
    {
        public MapperInitializer()
        {
            CreateMap<Product, ProductDTO>().ReverseMap();
            CreateMap<Product, ProductResponseDTO>().ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.Brand.Name)).ReverseMap();
            CreateMap<Order, OrderDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<Comment, CommentDTO>().ReverseMap();
            CreateMap<User, UserCommentDTO>().ReverseMap();
            CreateMap<Energy, EnergyDTO>().ReverseMap();
            CreateMap<Brand, BrandDTO>().ReverseMap();
            CreateMap<Material, MaterialDTO>().ReverseMap();
            CreateMap<WaterResistance, WaterResistancesDTO>().ReverseMap();
            CreateMap<Order, ListOrderDTO>().ReverseMap();
            CreateMap<Size, SizeDTO>().ReverseMap();
            CreateMap<Product, ProductSearchResponse>().ReverseMap();
            CreateMap<Rate, RateDTO>().ReverseMap();
        }
    }
}
