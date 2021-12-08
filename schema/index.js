const graphql = require("graphql");
const _ = require("lodash");
const dataPT = require("../data/pt.json");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLError,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = graphql;

const PTType = new GraphQLObjectType({
  name: "PerguruanTinggi",
  description: "Perguruan Tinggi yang ada di Indonesia",
  fields: () => ({
    kode: {
      type: new GraphQLNonNull(GraphQLID),
      description: "Kode Perguruan Tinggi",
    },
    nama: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Nama Perguruan Tinggi",
    },
    provinsi: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Provinsi dari Perguruan Tinggi",
    },
    kabupatenKota: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Kabupaten atau Kota dari Perguruan Tinggi",
    },
    kecamatan: {
      type: GraphQLString,
      description: "Kecamatan dari Perguruan Tinggi",
    },
    alamat: {
      type: GraphQLString,
      description: "Alamat dari Perguruan Tinggi",
    },
    tautan: {
      type: GraphQLString,
      description: "Tautan/link website resmi Perguruan Tinggi",
    },
    telepon: {
      type: GraphQLString,
      description: "Nomor Telepon resmi Perguruan Tinggi",
    },
    surel: {
      type: GraphQLString,
      description: "Surel/Email resmi Perguruan Tinggi",
    },
    bentuk: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        "Bentuk Perguruan Tinggi (Universitas/Institut/Politeknik/Sekolah Tinggi/Akademi/Akademi Komunitas",
    },
    lembaga: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Lembaga/Instansi yang menaungi Perguruan Tinggi",
    },
    kelompokKoordinator: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        "Kelompok Koordinator Perguruan Tinggi (Swasta/Negeri/Kedinasan/Agama)",
    },
  }),
});

const SaringPTInputType = new GraphQLInputObjectType({
  name: "SaringPTInput",
  description: "Saring data Perguruan Tinggi berdasarkan aspek tertentu",
  fields: {
    provinsi: {
      type: GraphQLString,
    },
    kabupatenKota: {
      type: GraphQLString,
    },
    kecamatan: {
      type: GraphQLString,
    },
    bentuk: {
      type: GraphQLString,
    },
    lembaga: {
      type: GraphQLString,
    },
    kelompokKoordinator: {
      type: GraphQLString,
    },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    perguruanTinggi: {
      type: PTType,
      description: "Perguruan Tinggi yang ada di Indonesia",
      args: {
        kode: { type: GraphQLID },
        nama: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return _.find(dataPT, (obj) => {
          if (_.isEmpty(args))
            throw new GraphQLError("1 argument must be provided");
          if (Object.keys(args).length > 1)
            throw new GraphQLError("only 1 argument can be provided");
          const k = Object.keys(args);
          if (args[k] === obj[k]) return true;
          return false;
        });
      },
    },
    semuaPerguruanTinggi: {
      type: new GraphQLList(PTType),
      description: "Kumpulan Perguruan Tinggi (Array)",
      args: {
        saring: {
          type: SaringPTInputType,
          description: "Saring data berdasarkan aspek tertentu",
        },
        cari: {
          type: GraphQLString,
          description: "Cari data berdasarkan teks yang dimasukkan",
        },
        awal: {
          type: GraphQLInt,
          description:
            "Posisi awal dari kumpulan perguruan tinggi yang ingin diambil",
        },
        jumlah: {
          type: GraphQLInt,
          description: "Jumlah Perguruan Tinggi yang ingin di ambil",
        },
      },
      resolve: (parent, { saring, cari, awal, jumlah }) => {
        return _(dataPT)
          .filter((obj) => {
            if (_.isEmpty(saring)) return true;
            return _.every(saring, (value, key) => {
              if (obj[key] === value) return true;
            });
          })
          .filter((obj) => {
            if (cari) {
              let found;
              _.forEach(obj, (v, k, c) => {
                if (new RegExp(cari, "i").test(v)) {
                  found = true;
                  return false; // exit loop
                }
              });
              if (found) return true;
            }
            return true;
          })
          .slice(awal ?? 0, (awal ?? 0) + (jumlah ?? dataPT.length));
      },
    },
  },
});

const PTSchema = new GraphQLSchema({
  query: RootQueryType,
});

module.exports = PTSchema;
